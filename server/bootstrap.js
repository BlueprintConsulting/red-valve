Meteor.startup(function(){
  if(ValvePosts.find().count() === 0){
    ValvePosts.insert({
      _id: "bootstrap",
      original_text: "Some test text",
      permalink: "http://www.bpcs.com",
      clean_text: "Some clean text", //need for sentiment analysis
      submitted: moment().format('MMM Do YYYY, h:mm a'),
      updated: moment().format('MMM Do YYYY, h:mm a')
      });
   }
   else {
     ValvePosts.remove("bootstrap");
   }


  if(ValveMetrics.find().count() === 0){
    ValveMetrics.insert({
      _id: "main",
      ungraded: 0,
      positive: 0,
      neutral: 0,
      negative: 0,
      total: 0,
      score: 0,
      byMonth: [],
      updated: moment().format('MMM Do YYYY, h:mm a')
      });
   }
});
