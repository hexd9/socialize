const { User, Thought } = require('../models');
const userController = {
    async getUsers(req, res) {
        try{
            const userData = await User.find().select('-__v')
            res.json(userData)
        } catch(err){
            console.log(err)
            res.status(500).json(err)
        }
    },
    async getSingleUser (req, res){
        try{
            const userData = await User.findOne({_id: req.params.userId})
            .select('-__v')
            .populate('friends')
            .populate('thoughts')
            if(!userData){
                return res.status(404).json({message: 'no user data'})
            }
            res.json(userData)
        }
        catch(err){
            console.log(err)
            res.status(500).json(err)
        }
    },
    
}

module.exports = userController