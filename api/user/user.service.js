
const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const reviewService = require('../review/review.service')
const utilService = require('../../services/util.service.js')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    query,
    getById,
    getByUsername,
    remove,
    update,
    add
}

async function query(filterBy = {}) {
    const criteria = _buildCriteria(filterBy)
    try {
        const collection = await dbService.getCollection('user')
        var users = await collection.find(criteria).toArray()
        users = users.map(user => {
            delete user.password
            user.createdAt = ObjectId(user._id).getTimestamp()
            // Returning fake fresh data
            // user.createdAt = Date.now() - (1000 * 60 * 60 * 24 * 3) // 3 days ago
            return user
        })
        return users
    } catch (err) {
        logger.error('cannot find users', err)
        throw err
    }
}

async function getById(userId) {
    try {
        const collection = await dbService.getCollection('user')
        const user = await collection.findOne({ '_id': ObjectId(userId) })
        delete user.password

        user.givenReviews = await reviewService.query({ byUserId: ObjectId(user._id) })
        user.givenReviews = user.givenReviews.map(review => {
            delete review.byUser
            return review
        })

        return user
    } catch (err) {
        logger.error(`while finding user ${userId}`, err)
        throw err
    }
}
async function getByUsername(username) {
    try {
        const collection = await dbService.getCollection('user')
        const user = await collection.findOne({ username })
        return user
    } catch (err) {
        logger.error(`while finding user ${username}`, err)
        throw err
    }
}

async function remove(userId) {
    try {
        const collection = await dbService.getCollection('user')
        await collection.deleteOne({ '_id': ObjectId(userId) })
    } catch (err) {
        logger.error(`cannot remove user ${userId}`, err)
        throw err
    }
}

async function update(user) {
    try {
        // peek only updatable fields!
        const userToSave = {
            _id: ObjectId(user._id), // needed for the returnd obj
            username: user.username,
            fullname: user.fullname,
        }
        const collection = await dbService.getCollection('user')
        await collection.updateOne({ _id: userToSave._id }, { $set: userToSave })
        return userToSave;
    } catch (err) {
        logger.error(`cannot update user ${user._id}`, err)
        throw err
    }
}

async function add(user) {
    try {
        // peek only updatable fields!
        const userToAdd = {
            username: user.username,
            password: user.password,
            fullname: user.fullname,
            isAdmin: false,
            isSeller: false,
            imgUrl: 'https://res.cloudinary.com/pivarr/image/upload/v1639125254/download_1_qwagl4.png',
            reviews: _getRandomReview(),
        }
        const collection = await dbService.getCollection('user')
        await collection.insertOne(userToAdd)
        return userToAdd
    } catch (err) {
        logger.error('cannot insert user', err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.txt) {
        const txtCriteria = { $regex: filterBy.txt, $options: 'i' }
        criteria.$or = [
            {
                username: txtCriteria
            },
            {
                fullname: txtCriteria
            }
        ]
    }
    if (filterBy.minBalance) {
        criteria.balance = { $gte: filterBy.minBalance }
    }
    return criteria
}


function _getRandomReview() {
    var users = [{
        _id: '61ad269c25f6e20363417edc',
        fullname: 'paz',
        imgUrl: 'https://res.cloudinary.com/pivarr/image/upload/v1638859873/Avatar/rp9ihx6v2j27rn22txvs_afqsfh.jpg',
    },
    {
        _id: '61ad26b425f6e203634194e0',
        fullname: 'revital',
        imgUrl: 'https://res.cloudinary.com/pivarr/image/upload/v1638861706/Avatar/pexels-pixabay-415829_fcn8qj.jpg',
    },
    {
        _id: '61ad26c525f6e2036341a228',
        fullname: 'izack',
        imgUrl: 'https://res.cloudinary.com/pivarr/image/upload/v1638435059/logo%20design/seller-2/avatar_z3dsdo.jpg',
    },
    {
        _id: '61ad26da25f6e2036341b3ef',
        fullname: 'yaron',
        imgUrl: 'https://res.cloudinary.com/pivarr/image/upload/v1638435059/logo%20design/seller-2/avatar_z3dsdo.jpg',
    }
    ]
    var txts = ['This was a very fast delivery from a very professional seller. I asked and he delivered! I can highly recommend him to you.',
        'Great communication, very fast. Will do business again and again! Thank You',
        'As always great seller and quick , would continew use his services',
        'My 7th order with this amazing seller. Always available to do work',
        'Great Seller and experience (one of the best I have had on Fiverr). Professional and great looking product and delivered everything we asked for in our brief. Worked through feedback and revisions with ease and was a pleasure to work with. Reached out for advice on other web related matters and they were more than happy to help, great experience all round.',
        'High quality delivery with great communication. Id definitely recommend and hire again!',
        'Adil was great as usual, we have worked with him many times. He was able to take our requirements and create a web page that exactly met our needs.',
        'All good, work is always done with good communication',
        'Isuruin built us a well organized site with everything we asked for. He understood our needs and delivered a great site for our new business. Thanks again Isuruin',
        'Thank you so much! Glad that you choose me to give reality to your imagination and was delivered as you wanted.',
        'Awesome design. Exceeded expectations significantly. In fact, he did so well that Im already hiring him for another project. Hard to beat that! Great communication too',
        'Added an addition to my website. Thank you Id recommend Isuruin to others',
        'Excellent designs. Willing to make adjustments according to your needs.',
        'great freelancer really recommend this guy he does a solid job!',
        'Amazing Person, understand well the rquirments and very very supportive nd quick, will use this seller services in future projects.',]

    var reviews = [];




    for (let index = utilService.getRandomInt(3, 6); index >= 0; index--) {
        var review = {
            id: utilService.makeId(),
            txt: txts[utilService.getRandomInt(0, 13)],
            rate: 5,
            by: users[utilService.getRandomInt(0, 3)]

        }

        reviews.push(review)
    }
    return reviews
}





