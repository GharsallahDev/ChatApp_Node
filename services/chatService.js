var socketIo = require('socket.io')
const Message = require('../models/Message');

module.exports = {
    socketIO(server) {
        const io = socketIo(server);
        return io;
    },
    async showMessages(req, res, next) {
        try {
            const messages = await Message.find();

            res.render('chat', { messages });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error retrieving messages.');
        }
    },
    async saveMessage(req, res) {
        const { username, content } = req.body;

        const newMessage = new Message({
            username,
            content,
        });

        try {
            console.log('Attempting to save message:', newMessage);
            const savedMessage = await newMessage.save();
            console.log('Message saved successfully:', savedMessage);
            res.status(200).send('Message saved successfully.');
        } catch (err) {
            console.error('Error saving message:', err);
            res.status(500).send('Error saving the message.');
        }
    },
}