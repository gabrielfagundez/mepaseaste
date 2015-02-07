app.factory('Query', ['$resource', function($resource) {
  return $resource('/queries/:id', { id: '@id', format: 'json' });
}]);