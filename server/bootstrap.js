Meteor.startup(function(){
  if(ValveMetrics.find().count() === 0){
    ValveMetrics.insert({
      _id: "bootstrap",
      original_text: "Some test text",
      permalink: "http://www.bpcs.com",
      clean_text: "Some clean text", //need for sentiment analysis
      submitted: moment().format('MMM Do YYYY, h:mm a'),
      updated: moment().format('MMM Do YYYY, h:mm a')
      });
   }
});
