angular.module('soRandom.storyViewerController', [])

.controller('storyViewerCtrl', function($scope, $stateParams, storyData) {
  $scope.storyData = storyData.get($stateParams.storySlug);

  $scope.tangentPage = function(paragraph){
    // redirect to proper tangent page for given paragraph
  };

  $scope.nextPage = function(){
    // redirect to next page with requisite limit checks
  };

  $scope.prevPage = function(){
    // redirect to previous page with requisite limit checks
  };

  $scope.setPageData = function(storyData){
    var pageData = {
      title: storyData.title,
      paragraphs: Array(storyData.perPage)
    }
  };
})
