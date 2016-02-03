Meteor.startup(function(){

  if(ValvePosts.find().count() === 0){
     ValvePosts.insert({
       _id:"zzzzzzz",
       original_text:"This is some test text",
       clean_text: "",
       submitted: "00-00-0000",
       sentiment_value: 1,
       sentiment: "positive",
       updated: moment().format('MMM Do YYYY, h:mm a')
     });
  }

  if(ValveMetrics.find().count() === 0){
     ValveMetrics.insert({
       _id: "main",
       negative:0,
       positive: 0,
       neutral: 0,
       overal: 'neutral',
       score: 0,
       ungraded: 0,
       updated: moment().format('MMM Do YYYY, h:mm a')
     });
  }
});
