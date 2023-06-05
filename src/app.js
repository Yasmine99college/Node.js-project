const express = require('express');
const mongoose = require('mongoose');

async function connectToMongoDB() {
    try {

        await mongoose.connect('mongodb+srv://user1:123@atlascluster.ehnugvt.mongodb.net/?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

connectToMongoDB();
const Question = require('./question');
const Topic = require('./topics');


const app = express();
app.use(express.urlencoded({ extended: true }));

app.get('/search', async (req, res) => {
    try {
        const { q } = req.query;
        const topics = await Topic.find().exec();

        const matchingTopics = topics.filter((topic) => {
            const level1Match = topic['Topic Level 1'] && topic['Topic Level 1'].includes(q);
            const level2Match = topic['Topic Level 2'] && topic['Topic Level 2'].includes(q);
            const level3Match = topic['Topic Level 3'] && topic['Topic Level 3'].includes(q);
            return level1Match || level2Match || level3Match;
        });
        console.log(matchingTopics);

        let questionNumbers = [];

        for (let i = 1; i <= 5; i++) {
            const annotationKey = `Annotation ${i}`;
            const annotations = matchingTopics
                .flatMap((topic) => [
                    topic['Topic Level 1'],
                    topic['Topic Level 2'],
                    topic['Topic Level 3'],
                ])
                .filter((value) => value !== undefined);

            if (annotations.length > 0) {
                const matchQuery = { [annotationKey]: { $in: annotations } };
                const questions = await Question.find(matchQuery).exec();
                questionNumbers.push(questions.map((question) => question['Question number']));
            }
        }
        let newArr = [];
        for (var i = 0; i < questionNumbers.length; i++) {
            newArr = newArr.concat(questionNumbers[i]);
        }

        console.log('Question Numbers:', newArr);
        res.json(newArr);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


