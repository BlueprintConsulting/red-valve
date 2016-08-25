Template.home.rendered = function() {
  Template.home.getMetrics(true, true, true);
};

Template.topNav.events({
  'click #checkForPosts': function () {
    Meteor.call("getPosts");
  },

  'click #checkSentiment': function () {
    Meteor.call("getSentiment");
  },

  'click #checkMonths': function () {
    Meteor.call("getByMonth");
  },

  'click #downloadCSV':function(){
    var nameFile = 'redValve-posts.csv';
    Meteor.call('downloadCSV', function(err, fileContent) {
    if(fileContent){
      var blob = new Blob([fileContent], {type: "text/plain;charset=utf-8"});
      saveAs(blob, nameFile);
    }
    });
  }
});

Template.home.getMetrics = function(displayPos, displayNeg, displayNeu){
  var labelsArr = [];
  var positiveArr = [];
  var negativeArr = [];
  var neutralArr = [];
  var datasets = [];
  var myData, positiveDataSet, negativeDataSet, neutralDataSet;
  var chartData = Meteor.call("getByMonth", function(err, monthlyData){
    $.each(monthlyData, function(i,obj){
      labelsArr.push(obj.date);
      positiveArr.push(obj.positive);
      negativeArr.push(obj.negative);
      neutralArr.push(obj.neutral);
    });


    positiveDataSet = {
        label: "Positive",
        fillColor: "rgba(0, 166, 90, .0)",
        strokeColor: "rgba(0, 166, 90, 1)",
        pointColor: "rgba(0, 166, 90, 1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(220,220,220,1)",
        data: positiveArr
    };

    negativeDataSet = {
        label: "Negative",
        fillColor: "rgba(221, 75, 57, .0)",
        strokeColor: "rgba(221, 75, 57, 1)",
        pointColor: "rgba(221, 75, 57, 1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(151,187,205,1)",
        data: negativeArr
    };

    neutralDataSet = {
        label: "Neutral",
        fillColor: "rgba(243, 156, 18, .0)",
        strokeColor: "rgba(243, 156, 18, 1)",
        pointColor: "rgba(243, 156, 18, 1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(151,187,205,1)",
        data: neutralArr
    };

    if(displayPos)
    {
      datasets.push(positiveDataSet);
    }

    if(displayNeg){
      datasets.push(negativeDataSet);
    }
    if(displayNeu){
      datasets.push(neutralDataSet);
    }

    myData = {
      labels: labelsArr,
      datasets: datasets
    };

    Template.home.drawChart(myData);

  });

  return Meteor.call('getMetrics');
};

Template.home.drawChart = function(myData){
      var ctx = document.getElementById("monthlyChart").getContext("2d");
      if(window.lineChart)
      {
        window.lineChart.destroy();
      }
      var lineChart = new Chart(ctx).Line(myData);
};

Template.home.helpers({
  posts:function(){
    return ValvePosts.find({},{sort:{submitted: +1}});
  },
  metrics:function(){
    return ValveMetrics.find({},{sort:{submitted: +1}});
  },
  showNeutral:function(){
    Session.get('showNeutralSession');
  }
});

Template.home.events({
  'click #neutralCount': function () {
    Template.home.getMetrics(false, false, true);
    $(".negative, .positive, .neutral").show();
    $(".negative, .positive").toggle();
    $('#postsType').html('NEUTRAL');
  },
  'click #positiveCount': function () {
    Template.home.getMetrics(true, false, false);
    $(".negative, .positive, .neutral").show();
    $(".negative, .neutral").toggle();
    $('#postsType').html('POSITIVE');
  },
  'click #negativeCount': function () {
    Template.home.getMetrics(false, true, false);
    $(".negative, .positive, .neutral").show();
    $(".positive, .neutral").toggle();
    $('#postsType').html('NEGATIVE');
  },
  'click #allCount':function(){
    Template.home.getMetrics(true, true, true);
    $(".negative, .positive, .neutral").show();
    $('#postsType').html('ALL');
  }
});

Template.registerHelper('formatDate', function(date) {
  return moment.unix(date).format("dddd, MMMM Do YYYY, h:mm:ss a");
});
