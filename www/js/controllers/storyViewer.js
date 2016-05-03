'use strict';

angular.module('soRandom.storyViewerController', []).controller('storyViewerCtrl', function ($localStorage, $scope, $stateParams, $state, storyData) {
  $scope.storyData = storyData.get($stateParams.storySlug);
  $scope.storage = $localStorage;
  $scope.pageType = 'par';

  // Initialize prevCurrPage
  if (!$scope.storage.prevCurrPage) {
    $scope.storage.prevCurrPage = 1;
    console.log('initialized prevCurrPage to 1');
  }

  if (!$stateParams.currPage) {
    $scope.pageType = 'par';
    $scope.currPage = 1;
    if ($scope.storage.prevCurrPage) {
      $scope.currPage = $scope.storage.prevCurrPage;
    } else {
      $scope.storage.prevCurrPage = 1;
      console.log('set prevCurrPage: ' + $scope.storage.prevCurrPage + ' and currPage to: ' + $scope.currPage);
    }
  } else if (parseInt($stateParams.currPage)) {
    $scope.currPage = parseInt($stateParams.currPage);
    $scope.storage.prevCurrPage = $scope.currPage;
    $scope.pageType = 'par';
    console.log('set prevCurrPage: ' + $scope.storage.prevCurrPage + ' and currPage to: ' + $scope.currPage);
  } else {
    $scope.currPage = $stateParams.currPage;
    $scope.pageType = 'tangent';
    console.log('pageType tangent -- left prevCurrPage: ' + $scope.storage.prevCurrPage + ' and currPage to: ' + $scope.currPage);
  }

  $scope.pageArray = Array($scope.storyData.numPages);

  $scope.goTangentPage = function (keyword) {
    // redirect to proper tangent page for given paragraph

    if ($scope.pageType !== 'tangent') {
      console.log('Moving reader to tangent page: ' + keyword);
      $state.go('app.storyViewer', {
        storySlug: $scope.storyData.storySlug,
        currPage: keyword
      });
    } else {
      console.log('Moving reader back to previous page: ' + $scope.storage.prevCurrPage);
      $state.go('app.storyViewer', {
        storySlug: $scope.storyData.storySlug,
        currPage: $scope.storage.prevCurrPage
      });
    }
  };

  $scope.goPage = function (pageNum) {
    // redirect to a specific page
    $state.go('app.storyViewer', {
      storySlug: $scope.storyData.storySlug,
      currPage: pageNum
    });
  };

  $scope.nextPage = function () {
    // redirect to next page with requisite limit checks
    if ($scope.currPage < $scope.storyData.numPages) {
      // safe to move to next page
      $state.go('app.storyViewer', {
        storySlug: $scope.storyData.storySlug,
        currPage: $scope.currPage + 1
      });
    }
  };

  $scope.prevPage = function () {
    // redirect to previous page with requisite limit checks
    if ($scope.currPage > 1) {
      // safe to move to next page
      $state.go('app.storyViewer', {
        storySlug: $scope.storyData.storySlug,
        currPage: $scope.currPage - 1
      });
    }
  };

  $scope.selectRandomNarr = function (narrList) {
    var maxIndex = narrList.length - 1;
    return narrList[Math.floor(Math.random() * maxIndex)];
  };

  $scope.setPageData = function (storyData) {
    var pageData = {
      title: storyData.title,
      paragraphs: []
    };
    if ($scope.pageType === 'par') {
      for (var i = 1; i <= storyData.perPage; i++) {
        var randNarr = $scope.selectRandomNarr(storyData.text.narrators);
        var parNum = i * $scope.currPage;
        pageData.paragraphs.push(storyData.text.paragraphs[randNarr][parNum]);
      }
    } else if ($scope.pageType === 'tangent') {
      // fill with tangent data
      for (var par in storyData.text.tangents[$scope.currPage]) {
        pageData.paragraphs.push(storyData.text.tangents[$scope.currPage][par]);
      }
    }
    return pageData;
  };

  $scope.pageData = $scope.setPageData($scope.storyData);

  // Event listeners to keep things fresh
  $scope.$on('$ionicView.enter', function (e) {
    $scope.pageData = $scope.setPageData($scope.storyData);
  });
});