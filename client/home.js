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
  return Meteor.call('getMetrics');
};

Template.home.helpers({
  posts:function(){
    return ValvePosts.find({},{sort:{submitted: -1}});
  },
  metrics:function(){
    return ValveMetrics.find({});
  }
});
