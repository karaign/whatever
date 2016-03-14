(function(angular, undefined) {
  angular.module("whateverApp.constants", [])

.constant("appConfig", {
	"userRoles": [
		"guest",
		"user",
		"admin"
	],
	"badUsernames": [],
	"postsPerPage": 5
})

;
})(angular);