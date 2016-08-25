Meteor.methods({

  getMetrics:function(){
    console.log('getMetrics called');
    var negative = 0;
    var positive = 0;
    var neutral = 0;
    var overall = 'neutral';
    var score = 0;
    var ungraded = 0;
    ValvePosts.find({},{sort:{submitted: -1}}).forEach(function(obj){
        if(obj.sentiment === 'negative')
        {
          negative++;
          score--;
        }
        else if(obj.sentiment === 'positive')
        {
          positive++;
          score++;
        }
        else if((obj.sentiment === 'neutral'))
        {
          neutral++;
        }
        else {
          ungraded++;
        }
    });

    var byMonth = Meteor.call('getByMonth');


    ValveMetrics.upsert({
      _id: "main",
    }, {
      $set: {
        ungraded: ungraded,
        positive: positive,
        neutral: neutral,
        negative: negative,
        total: ungraded + positive + neutral + negative,
        score: score,
        byMonth: byMonth,
        updated: moment().format('MMM Do YYYY, h:mm a')
      }
    });

    if(ungraded > 0)
    {
      Meteor.setTimeout(function(){
        Meteor.call('getSentiment');
      }, 30000);
    }
    return true;
  },

  getSentiment: function() {
    console.log('getSentiment called');
    var sentimentValue = 0;
    var count = 0;
    var posts = ValvePosts.find({},{sort:{submitted: -1}}).forEach(function(obj){
      if(obj.sentiment === "" || obj.sentiment === undefined || obj.sentiment === null)
      {
          count++;
        if(count<4)
        {
          HTTP.post("https://api.monkeylearn.com/v2/classifiers/cl_mcHq5Mxu/classify/?sandbox=1",
          {
            headers: {'Authorization':'Token 780c28c5715a60acdcacdeadb07bc0fe6e61853c'},
            params: { "text_list": [obj.clean_text] }
          }, function(err, response) {
            var label = response.data.result[0][0].label;
            if(label.toLowerCase() == "positive")
            {
              sentimentValue = 1;
            }
            else if(label.toLowerCase() == "negative")
            {
              sentimentValue = -1;
            }
            else {
              sentimentValue = 0;
            }
            ValvePosts.update(obj._id, {
              $set: {
                sentiment: label,
                sentiment_value: sentimentValue,
                updated: moment().format('MMM Do YYYY, h:mm a')
              }
            });
          });
        }

      }
    });
    Meteor.call('getMetrics');
  },

  getPosts: function(id) {
    console.log('getPosts called');
    var params = "";
    if(typeof id !== 'undefined')
    {
      params = "?after=" + id;
    }

    HTTP.get("https://www.reddit.com/r/vive.json" + params, {}, function(err, response) {

      _.each(response.data.data.children, function(obj) {
        if(obj.data.selftext !== "")
        {
          ValvePosts.upsert(obj.data.id, {
            $set: {
              original_text: obj.data.selftext,
              permalink: obj.data.permalink,
              clean_text: obj.data.selftext.replace(/[^\w\s]|_/g, " "), //need for sentiment analysis
              submitted: obj.data.created,
              updated: moment().format('MMM Do YYYY, h:mm a')
            }
          });
        }
      });

      var nextID = response.data.data.after;

      if(nextID !== null)
      {
        Meteor.call("getPosts", nextID);
      }
      else {
        Meteor.call('getSentiment');
        console.log('all posts have been grabbed');
      }
    });
  },

  downloadCSV:function(){
    var collection = ValvePosts.find({},{fields: {original_text:0, updated:0, }}).fetch();
    var heading = true; // Optional, defaults to true
    var delimiter = ","; // Optional, defaults to ",";
    return exportcsv.exportToCSV(collection);
  },

  getByMonth:function(){
    var monthArr = [];

    ValvePosts.find({},{sort:{submitted: +1}}).forEach(function(obj){
      var date = moment.unix(obj.submitted).format("MMM YYYY");
      var sentiment = obj.sentiment;
        for(var i=0;i<monthArr.length;i++)
        {
          if(monthArr[i].date == date)
          {
            if(sentiment === 'positive')
            {
              monthArr[i].positive++;
            }
            else if(sentiment === 'negative')
            {
              monthArr[i].negative++;
            }else if(sentiment === 'neutral')
            {
              monthArr[i].neutral++;
            }
            else {
              monthArr[i].ungraded++;
            }
            //monthArr[i].count++;
            return;
          }
        }
        //monthArr.push({"date": date, "count": 1, "sentiment": obj.sentiment});
        if(sentiment === 'positive')
        {
          monthArr.push({"date": date, "positive": 1, "negative": 0, "neutral": 0, "ungraded": 0});
        }
        else if(sentiment === 'negative')
        {
          monthArr.push({"date": date, "positive": 0, "negative": 1, "neutral": 0, "ungraded": 0});
        }else if(sentiment === 'neutral')
        {
          monthArr.push({"date": date, "positive": 0, "negative": 0, "neutral": 1, "ungraded": 0});
        }
        else {
          monthArr.push({"date": date, "positive": 0, "negative": 0, "neutral": 0, "ungraded": 1});
        }
    });
    return monthArr;
  }



}); //end methods
