Template.home.rendered = function() {
  Template.home.getMetrics();
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
    var nameFile = 'redValve-valve-posts.csv';
    Meteor.call('downloadCSV', function(err, fileContent) {
    if(fileContent){
      var blob = new Blob([fileContent], {type: "text/plain;charset=utf-8"});
      saveAs(blob, nameFile);
    }
    });
  }
});

Template.home.getMetrics = function(){
  var labelsArr = [];
  var positiveArr = [];
  var negativeArr = [];
  var neutralArr = [];
  var myData;
  var chartData = Meteor.call("getByMonth", function(err, monthlyData){
    $.each(monthlyData, function(i,obj){
      labelsArr.push(obj.date);
      positiveArr.push(obj.positive);
      negativeArr.push(obj.negative);
      neutralArr.push(obj.neutral);

    });

    myData = {
      labels: labelsArr,
      datasets: [
          {
              label: "Positive",
              fillColor: "rgba(0, 166, 90, .0)",
              strokeColor: "rgba(0, 166, 90, 1)",
              pointColor: "rgba(0, 166, 90, 1)",
              pointStrokeColor: "#fff",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(220,220,220,1)",
              data: positiveArr
          },
          {
              label: "Negative",
              fillColor: "rgba(221, 75, 57, .0)",
              strokeColor: "rgba(221, 75, 57, 1)",
              pointColor: "rgba(221, 75, 57, 1)",
              pointStrokeColor: "#fff",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(151,187,205,1)",
              data: negativeArr
          },
          {
              label: "Neutral",
              fillColor: "rgba(243, 156, 18, .0)",
              strokeColor: "rgba(243, 156, 18, 1)",
              pointColor: "rgba(243, 156, 18, 1)",
              pointStrokeColor: "#fff",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(151,187,205,1)",
              data: neutralArr
          }
      ]
  };
  var ctx = document.getElementById("monthlyChart").getContext("2d");
  var lineChart = new Chart(ctx).Line(myData);

  });




  return Meteor.call('getMetrics');
};

Template.home.helpers({
  posts:function(){
    return ValvePosts.find({},{sort:{submitted: -1}});
  },
  metrics:function(){
    return ValveMetrics.find({});
  },
  showNeutral:function(){
    Session.get('showNeutralSession');
  }
});

Template.home.events({
  'click #neutralCount': function () {
    $(".negative, .positive, .neutral").show();
    $(".negative, .positive").toggle();
  },
  'click #positiveCount': function () {
    $(".negative, .positive, .neutral").show();
    $(".negative, .neutral").toggle();
  },
  'click #negativeCount': function () {
    $(".negative, .positive, .neutral").show();
    $(".positive, .neutral").toggle();
  },
  'click #allCount':function(){
    $(".negative, .positive, .neutral").show();
  }
});
