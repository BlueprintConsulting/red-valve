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


  if(ValveMetrics.find().count() === 0){
    ValveMetrics.insert({
      _id: "bootstrap",
      ungraded: 0,
      positive: 1,
      neutral: 0,
      negative: 0,
      total: 1,
      score: 1,
      byMonth: [],
      updated: moment().format('MMM Do YYYY, h:mm a')
      });
   }
});
