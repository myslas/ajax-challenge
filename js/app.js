"use strict";
/*
    app.js, main Angular application script
    define your module and controllers here
*/
var commentsUrl = 'https://api.parse.com/1/classes/comments';

angular.module('CommentsApp', ['ui.bootstrap'])
    .config(function($httpProvider) {
        $httpProvider.defaults.headers.common['X-Parse-Application-Id'] = 'QT9TvlmzWKxT8rODgouZLX2ekkHBibzORMic86UP';
        $httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = '4Ft1p8l2A5d2HeVvdNMnj0iMmCN6FBbXOBt0t9OX';
    })
    .controller('CommentController', function($scope, $http) {
        $scope.refreshComments = function() {
            $scope.loading = true;
            $http.get(commentsUrl)
                .success(function(data) {
                    var comments = data.results;
                    console.log(comments);
                    comments.sort(function (a, b) {
                        if (a.score > b.score) {
                            return -1;
                        }
                        if (a.score < b.score) {
                            return 1;
                        }
                        // a must be equal to b
                        return 0;
                    });
                    $scope.comments = comments;
                })
                .error(function(err) {
                    $scope.errorMessage= err;
                })
                .finally(function() {
                    $scope.loading = false;
                });
        };

        $scope.refreshComments();

        $scope.newComment = {};

        $scope.addComment = function() {
            $scope.updating = true;
            $http.post(commentsUrl, $scope.newComment)
                .success(function(responseData) {
                    $scope.newComment.objectId = responseData.objectId;
                    $scope.comments.push($scope.newComment);
                    $scope.newComment = {};
                })
                .error(function(err) {
                    $scope.errorMessage = err;
                })
                .finally(function () {
                    $scope.updating = false;
                });
        };

        $scope.incrementVotes = function(comment, amount) {
            $scope.updating = true;
            if (!(amount == -1 && comment.score == 0)) {

            $http.put(commentsUrl + '/' + comment.objectId, {
                score: {
                    __op: 'Increment',
                    amount: amount
                }
            })
                .success(function (responseData) {
                    console.log(responseData);
                    comment.score = responseData.score;
                })
                .error(function (err) {
                    console.log(err)
                })
                .finally(function () {
                    $scope.updating = false;
                })
            }
        }

        $scope.deleteComment = function(comment) {
            $scope.updating = true;
            $http.delete(commentsUrl + '/' + comment.objectId)
                .success(function (responseData) {
                    $scope.refreshComments();
                })
                .error(function (err) {
                    console.log(err);
                })
                .finally(function () {
                    $scope.updating = false;
                })
        }
    });