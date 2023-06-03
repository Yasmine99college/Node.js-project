const express = require('express');
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://user1:PENCILSPACE@atlascluster.ehnugvt.mongodb.net/?retryWrites=true&w=majority'
    ,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
).then(() => {
    console.log('Connected to MongoDB');
})
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });
const Question = require('./question');
const Topic = require('./topics');

const app = express();
app.use(express.urlencoded({ extended: true }))





app.get('/search', (req, res) => {
    const { q } = req.query; 

    Topic.find()
        .then((topics) => {
            // Find the matching topic
            const matchingTopics = topics.filter((topic) => {
                const level1Match = topic['Topic Level 1'] && topic['Topic Level 1'].includes(q);
                const level2Match = topic['Topic Level 2'] && topic['Topic Level 2'].includes(q);
                const level3Match = topic['Topic Level 3'] && topic['Topic Level 3'].includes(q);
                return level1Match || level2Match || level3Match;
            });

            if (matchingTopics.length > 0) {
                const matchQuery = {};
                for (let i = 1; i <= 5; i++) {
                    matchQuery[`Annotation ${i}`] = {
                        $in: matchingTopics.flatMap((topic) => [
                            topic['Topic Level 1'],
                            topic['Topic Level 2'],
                            topic['Topic Level 3'],
                        ]).filter((value) => value !== undefined),
                    };
                }
                // const sampleData = [
                //     {
                //         'Question number': 1,
                //         'Annotation 1': 'Sample annotation 1',
                //         'Annotation 2': 'Sample annotation 2',
                //         'Annotation 3': 'Sample annotation 3',
                //         'Annotation 4': 'Sample annotation 4',
                //         'Annotation 5': 'Sample annotation 5',
                //     },
                //     // Add more sample documents here
                // ];

                // Question.create(sampleData)
                //     .then(() => {
                //         console.log('Sample data inserted successfully');
                //         // Proceed with executing the search code
                //     })
                //     .catch((error) => {
                //         console.error('Error inserting sample data:', error);
                //     });
                // Question.find({}, 'Question number')
                //     .then((questions) => {
                //         const questionNumbers = questions.map((question) => question['Question number']);
                //         console.log(questionNumbers);
                //     })
                //     .catch((error) => {
                //         console.error('Error finding question numbers:', error);
                //     });



                console.log(matchQuery);
                Question.find({}, 'Annotation 1')
                    .then((questions) => {
                        const questionNumbers = questions.map((question) => question['Annotation 1']);
                        console.log(questionNumbers);
                    })
                    .catch((error) => {
                        console.error('Error finding question numbers:', error);
                    });
                
                Question.find(matchQuery)
                    .then( 
                        (questions) => {
                        console.log(questions);
                        const questionNumbers = questions.map((question) => question['Question number']);
                        res.json(questionNumbers);
                    })
                    .catch((error) => {
                        console.error('Error finding questions:', error);
                        res.status(500).json({ error: 'Internal Server Error' });
                    });
            } else {
                res.json([]); 
            }
        })
        .catch((error) => {
            console.error('Error finding topics:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});



const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
