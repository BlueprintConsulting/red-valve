Template.home.rendered = function() {
  Template.home.getMetrics();
};

Template.topNav.events({
  'click #checkForPosts': function () {
    Meteor.call("getPosts");
  },
  'click #checkSentiment': function () {
    Meteor.call("getSentiment");
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
