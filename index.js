const express = require('express');
const Sentiment = require('sentiment');
const fetch = require('node-fetch');
const app = express();
const router = express.Router();
const sentiment = new Sentiment();
app.use('/api',router);
const hackerNewsAPIUrl = `https://hacker-news.firebaseio.com/v0/`;
//https://hacker-news.firebaseio.com/v0/

 async function getTopStories(){
    const url = hackerNewsAPIUrl+'topstories.json?print=pretty';
    try{
        const responseStories = await fetch(url);
        const stories = await responseStories.json();
        return stories;
    } 
    catch(error){
        console.error(error);
    }
  
}
async function getStoryOfPhrase(storyId,phrase){
    const url = hackerNewsAPIUrl+'item/'+storyId+'.json?print=pretty';
    try {
        const responseStory = await fetch(url);
        const story = await responseStory.json();
       
        if(story && !story.error){
            //console.log(story);
            return story.title.search(phrase) > -1 ? story : null;
        } else{
            return {errorCode:416}
        }
    } catch (error) {
        console.error(error);
    }
  
}

async function getCommentsOfStory(commentID){
    
    const url = hackerNewsAPIUrl+'item/'+commentID+'.json?print=pretty';
    try {
        const responseStory = await fetch(url);
        const comment = await responseStory.json();
        return comment;
    }
    catch(error){
        console.log(error);
    }

}

async function analyzeStoriesComments(storieIds,phrase){
    try{
        const results = {};
        results.positive = 0;
        results.neutral = 0;
        results.negative = 0;
        let positive = 0;
        let negative = 0;
        let neutral = 0;

        if(storieIds.length){
                const promiseArray = storieIds.map(async (storyId) => {
                    const story = await getStoryOfPhrase(storyId, phrase);
                    if(story && !story.errorCode && story.kids){
                        for(const commentId of story.kids){
                            const comment = await getCommentsOfStory(commentId);
                            if(comment){
                                const score = sentiment.analyze(comment.text).score;
                                if(score>0.1){
                                    positive++;
                                    results.positive = (positive/story.kids.length).toFixed(2);
                                }
                                else if(score<=0.1 && score>=-0.1){
                                    neutral++;
                                    results.neutral = (neutral/story.kids.length).toFixed(2);
                                }
                                else {
                                    negative++;
                                    results.negative = (negative/story.kids.length).toFixed(2);
                                }
                            }
                        }
                        return results;
                        
                    } else{
                        return null;
                       //console.log(story)
                    }
                });
                return promiseArray;
                
        } 
        else {
            return null;
        }
    }
    catch(error){
        return error;
    }
}

app.listen(3000,()=>{
    router.get('/sentiment', async (request,response)=>{
        const phrase = request.query.phrase;
       
        try{
            const storieIds= await getTopStories();
            const finalResults =  await analyzeStoriesComments(storieIds,phrase);
            Promise.all(finalResults).then((item)=>{
              response.json(item.find((res)=>res!==null));
              
            })
        } 
        catch(error){
            console.log(error);
        }
    
    });

});
