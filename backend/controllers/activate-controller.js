const sharp = require('sharp');
const path = require('path');
const userService = require('../services/user-service');
const UserDto = require('../dtos/user-dto');

class ActivateController {
    async activate(req, res) {
        // Activation logic
        const { name, avatar } = req.body;
        if (!name || !avatar) {
            return res.status(400).json({ message: 'All fields are required!' });
        }

        // Image Base64
        const buffer = Buffer.from(
            avatar.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''),
            'base64'
        );
        const imagePath = `${Date.now()}-${Math.round(Math.random() * 1e9)}.png`;

        try {
            await sharp(buffer)
                .resize(200) // Resize to a width of 150, height auto
                .toFile(path.resolve(__dirname, `../storage/${imagePath}`));
        } catch (err) {
            return res.status(500).json({ message: 'Could not process the image' });
        }

        const userId = req.user._id;

        // Update user
        try {
            const user = await userService.findUser({ _id: userId });
            if (!user) {
                return res.status(404).json({ message: 'User not found!' });
            }
            user.activated = true;
            user.name = name;
            user.avatar = `/storage/${imagePath}`;
            await user.save(); // Ensure to await user.save()
            return res.json({ user: new UserDto(user), auth: true });
        } catch (err) {
            return res.status(500).json({ message: 'Something went wrong!' });
        }
    }
}

module.exports = new ActivateController();