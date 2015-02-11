angular.module('starter.controllers', [])

    .controller('CommonController', ['$scope', '$rootScope', '$ionicLoading', function ($scope, $rootScope, $ionicLoading) {
        $scope.loading = $ionicLoading;
        $scope.loading.hide = $ionicLoading.hide;

    }])

    .controller('AppCtrl', function ($controller, $scope, $state, $ionicModal, $ionicScrollDelegate, $timeout, $rootScope, LoginService, SignService, CONFIG, AllcatsService) {

        $controller('CommonController', {$scope: $scope});

        $scope.$on('header.btn.change', function (event, data) {
            $scope.header_btn = data.btn;
            console.log(data.btn);
        });

        (function () {
            var sign = SignService.get();
            AllcatsService.get(sign, function (dt) {
                if (dt.error) {
                    alert(CONFIG.ERROR[dt.error]);
                } else {
                    $scope.menus = dt;
                }
                $scope.loading.hide();
            }, function () {
                alert(CONFIG.ERROR[999]);
                $scope.loading.hide();
            });

            LoginService.islogin(sign, function (dt) {
                if (dt.username) {
                    $scope.loginfo = {
                        username: dt.username
                    };
                }
            });
        })()

        // Form data for the login modal
        $scope.loginData = {};

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        $ionicModal.fromTemplateUrl('templates/register.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.regModal = modal;
        });

        $ionicModal.fromTemplateUrl('modal-findpwd.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.findpwdModal = modal;
        });

        $scope.toggleMenu = function (item) {
            item.childshown = !item.childshown;
            //appMenuScroll
            $ionicScrollDelegate.$getByHandle('appMenuScroll').resize();

        };

        $scope.findpwd = function () {
            $scope.closeLogin();
            $scope.findpwdModal.show();
            $scope.findpwdStep = 1;
        };

        $scope.closeFindpwd = function () {
            $scope.findpwdModal.hide();

        };

        $scope.findpwdData = {};
        $scope.resetpwdData = {};
        $scope.findpwdStep = 1;

        $scope.doFindpwd = function () {
            $scope.findpwdData = angular.extend($scope.findpwdData, SignService.get());

            $scope.loading.show();
            LoginService.findpwd($scope.findpwdData, function (dt) {
                if (dt.error == 0 && dt.msg) {
                    //发送成功，下一步
                    $scope.findpwdStep = 2;
                } else if (dt.error == 1 && dt.msg) {
                    alert('发送失败，请稍后重试');
                } else {
                    alert(CONFIG.ERROR[dt.error]);
                }
                $scope.loading.hide();
            }, function () {
                alert(CONFIG.ERROR[999]);
                $scope.loading.hide();
            })

        };

        $scope.doResetpwd = function () {
            $scope.resetpwdData = angular.extend($scope.resetpwdData, SignService.get());
            $scope.loading.show();
            LoginService.resetpwd($scope.resetpwdData, function (dt) {
                if (dt.succ == 1) {
                    alert('密码重设成功');
                    $scope.closeFindpwd();
                    $state.go('app.index');
                } else {
                    alert(CONFIG.ERROR[dt.error]);
                }
                $scope.loading.hide();
            }, function () {
                $scope.loading.hide();
                alert(CONFIG.ERROR[999]);
            });

        };

        // Triggered in the login modal to close it
        $scope.closeLogin = function () {
            $scope.modal.hide();
        };
        $scope.closeRegister = function () {
            $scope.regModal.hide();
        };

        // Open the login modal
        $scope.login = function () {
            $scope.closeRegister();
            $scope.modal.show();
        };

        $scope.register = function () {
            $scope.closeLogin();
            $scope.regModal.show();
            $scope.regData = {};
        };

        $scope.doRegister = function () {

            var sign = SignService.get();
            $scope.regData = angular.extend($scope.regData, sign);
            $scope.loading.show();
            LoginService.reg($scope.regData, function (dt) { //{"id":23271,"username":"15818108578"}
                if (dt.error) {
                    alert(CONFIG.ERROR[dt.error])
                } else {
                    $scope.loginfo = dt;
                }
                $scope.loading.hide();
            }, function () {
                alert(CONFIG.ERROR[999]);
                $scope.loading.hide();
            })
        };

        $scope.doLogout = function () {
            var sign = SignService.get();
            $scope.loading.show();
            LoginService.logout(sign, function (dt) {
                if (dt.logout == 1) {
                    $scope.loginfo = null;
                } else {
                    alert(CONFIG.ERROR[dt.error]);
                }
                $scope.loading.hide();
            }, function () {
                alert(CONFIG.ERROR[999]);
                $scope.loading.hide();
            });
        };

        // Perform the login action when the user submits the login form
        $scope.doLogin = function () {

            var sign = SignService.get();
            $scope.loginData = angular.extend($scope.loginData, sign);

            $scope.loading.show();
            LoginService.login($scope.loginData, function (dt) {
                if (dt.id) {
                    $scope.loginfo = dt;
                    $scope.closeLogin();

                    //todo 在其他页面登陆要刷新页面？

                } else {
                    alert(CONFIG.ERROR[dt.error]);
                }
                $scope.loading.hide();
            }, function () {
                alert(CONFIG.ERROR[999]);
                $scope.loading.hide();
            })

            // Simulate a login delay. Remove this and replace with your login
            // code if using a login system
            /* $timeout(function () {
             $scope.closeLogin();
             }, 1000);*/
        };

        $scope.goPlaylists = function (play) {
            $rootScope.title = play.name;
            $state.go('app.playlists', {id: play.id});
        };

        $scope.tab = {
            selectedTab: 0
        };

        $scope.showFilterPlaylists = function () {

            if ($scope.playlistmodal) {

                if ($scope.playlistmodal.isShown()) {
                    $scope.playlistmodal.hide();
                } else {
                    $scope.playlistmodal.show();
                }
                return;
            }

            $ionicModal.fromTemplateUrl('modal_playlist_filter.html', {
                scope: $scope,
                viewType: 'custom'
            }).then(function (modal) {
                $scope.playlistmodal = modal;
                $scope.playlistmodal.show();
            });

        };

        //过滤演出列表
        $scope.doChangePlaylists = function (filter) {
            $scope.$broadcast('playlists.change', {filter: filter});
            $scope.playlistmodal.hide();
        }

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {

            $scope.modal && $scope.modal.hide();
            $scope.playlistmodal && $scope.playlistmodal.hide();
            console.log('toState:==========' + toState.name);
            switch (toState.name) {
                case 'app.index': //首页
                    $scope.header_btn = 'search';
                    break;
                case 'app.playlists': //列表
                    $scope.header_btn = 'filter';
                    break;
                case 'app.search': //search
                    $scope.header_btn = '';
                    break;
            }

        });

    })

    .controller('LocationCtrl', ['$scope', '$rootScope', '$controller', '$state', function ($scope, $rootScope, $controller, $state) {

        $controller('CommonController', {$scope: $scope});
        $scope.loading.show();

        $scope.list = [
            {
                active: true,
                name: '北京'
            },
            {name: '上海'}

        ];

        $scope.chooseCity = function (item) {

            if (item.active) {
                return;
            }

            $scope.$emit('header.city.change', {city: item.name});
            $rootScope.city = item.name;

            $state.go('app.index');

        };

        setTimeout(function () {
            $scope.loading.hide();
        }, 100)
    }])

    .controller('MainCtrl', ['$scope', '$rootScope', '$controller', '$ionicSlideBoxDelegate', '$ionicScrollDelegate', 'HdpicService', 'SignService', 'HrankService', function ($scope, $rootScope, $controller, $ionicSlideBoxDelegate, $ionicScrollDelegate, HdpicService, SignService, HrankService) {
        $scope.$emit('header.btn.change', {btn: 'search'});

        $controller('CommonController', {$scope: $scope});
        $scope.loading.show();

        //
        $rootScope.city = '北京';

        $rootScope.$watch('city', function (newVal, oldVal) {
            if(newVal!== oldVal){

            }
        })

        HdpicService.query(SignService.get(), function (dt) {
            if (dt) {
                $scope.hdpic = dt;
            }
            $scope.loading.hide();

            //todo images ready
            setTimeout(function () {
                $ionicSlideBoxDelegate.$getByHandle('hdpic').update();
            }, 500)
        }, function () {
            $scope.loading.hide();
        });

        HrankService.query(SignService.get(), function (dt) {
            if (dt) {
                $scope.hrank = dt;
            }
            $ionicScrollDelegate.$getByHandle('appMenuScroll').resize();
        });

    }])

    .controller('MyCtrl', ['$scope', function ($scope) {
        $scope.$emit('header.btn.change', {btn: ''});
    }])

    .controller('MyOrderPayedCtrl', ['$scope', function ($scope) {

    }])

    .controller('MyOrderUnpayCtrl', ['$scope', function ($scope) {

    }])

    .controller('MyAddressCtrl', ['$scope', '$stateParams', '$state', '$ionicModal', '$ionicPopup', '$ionicPopover', 'CityListService', 'AddressService', 'SignService', 'CONFIG', function ($scope, $stateParams, $state, $ionicModal, $ionicPopup, $ionicPopover, CityListService, AddressService, SignService, CONFIG) {

        $scope.title = '地址管理';

        function getAddList() {
            AddressService.list(SignService.get(), function (dt) {
                if (!dt.error) {
                    $scope.data = dt;
                } else {
//                    alert(CONFIG.ERROR[dt.error])
                    $scope.data = dt;
                }
                $scope.loading.hide();
            }, function () {
                $scope.loading.hide();
            });
        }

        $scope.loading.show();
        getAddList();

        $ionicModal.fromTemplateUrl('modal_add_address.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        $scope.addressData = {};
        $scope.addAddressModal = function () {

            CityListService.query().then(function (dt) {
                $scope.title = '添加地址';
                $scope.citylist = dt.citylist;
                $scope.modal.show();

            });
        };

        $scope.closeModal = function () {
            $scope.modal.hide();
        };

        $scope.setDefaultAddress = function (event, item) {

            if (item.isdef == '1') {
                return;
            }
            AddressService.setdef(angular.extend({id: item.id, isdef: 1}, SignService.get()),
                function (dt) {
                    getAddList();
                });
//            $state.go('app.select_address', {id: $stateParams.id});
            event.stopPropagation();
            event.preventDefault();
        };

        $scope.delAddress = function (event, id) {

            var confirmPopup = $ionicPopup.confirm({
                cancelText: '取消',
                okText: '删除',
                okType: 'button-default',
                template: '将该地址从记录中删除'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    console.log('You are sure');
                    $scope.loading.show();
                    AddressService.delete(angular.extend({id: id}, SignService.get()), function (dt) {
                        if (dt.error) {
                            alert(CONFIG.ERROR[dt.error]);
                        } else {
                            alert('删除成功');
                            getAddList();

                        }
                    });
                } else {
                    console.log('You are not sure');
                }
            });

            event.stopPropagation();
            event.preventDefault();
        };

        $scope.doAddAdress = function () {

            var data = SignService.get();
            data.recaddress = $scope.addressData.province.p + $scope.addressData.city.n + $scope.addressData.addr;
            data = angular.extend(data, $scope.addressData);

            $scope.loading.show();

            AddressService.save(data, function (dt) {

                if (dt.error) {
                    alert(CONFIG.ERROR[dt.error]);
                } else {
                    //get address list
                    getAddList();

                    $scope.closeModal('addmodal');
                }
                $scope.loading.hide();

            })
        };
    }])

    .controller('MyPasswordCtrl', ['$scope', 'SignService', 'LoginService', 'CONFIG', function ($scope, SignService, LoginService, CONFIG) {

        $scope.passwordData = {};
        $scope.modpassword = function () {
            $scope.passwordData = angular.extend($scope.passwordData, SignService.get());

            LoginService.modpwd($scope.passwordData, function (dt) {
                if (dt.msg == 'succ') {
                    alert('修改成功');
                    $scope.passwordData = {};
                } else if (dt.error) {
                    alert(CONFIG.ERROR[dt.error]);
                } else if (dt.msg == 'fail') {
                    alert('修改失败');
                }
            })

        };

    }])

    .controller('TicketCtrl', ['$scope', '$controller', '$state', '$stateParams', 'ItemService', 'SignService', 'TicketService', function ($scope, $controller, $state, $stateParams, ItemService, SignService, TicketService) {
        $scope.$emit('header.btn.change', {btn: 'search'});

        $controller('CommonController', {$scope: $scope});
        $scope.loading.show();

        var params = angular.extend(SignService.get(), {
            id: $stateParams.cid
        })
        ItemService.get(params, function (dt) {
            if (dt) {
                $scope.data = dt;
            }
            $scope.loading.hide();
        }, function () {
            $scope.loading.hide();
        });

        $scope.selectItem = function (item) {
            angular.forEach($scope.data.ccdatas[$scope.data.selcityid].ccs, function (item, key) {
                item.active = false;
            });
            item.active = !item.active;

            var _params = angular.extend(SignService.get(), {
                cid: item.id
            });

            $scope.loading.show();
            TicketService.get(_params, function (dt) {
                if (dt) {
                    $scope.cpdatas = dt.cpdatas;
                }
                $scope.loading.hide();
            });

        };

        $scope.selectPrice = function (index) {

            angular.forEach($scope.cpdatas, function (value, key) {

                if (key !== index) {
                    value.active = false;
                } else {
                    value.active = true;
                    $scope.price = value.newprice;
                    $scope.ticket.ticketid = value.id;
                }

            });

        };

        $scope.ticket = {
            ticketnum: 1
        }; //ticketid ,ticketnum

        $scope.go = function () {

            $state.go('app.select_address', $scope.ticket);
        };

    }])

    .controller('SelectAddressCtrl', ['$scope', '$controller', '$stateParams', '$ionicModal', 'Order1Service', 'SignService', 'CityListService', 'AddressService', 'CONFIG', function ($scope, $controller, $stateParams, $ionicModal, Order1Service, SignService, CityListService, AddressService, CONFIG) {
        $scope.$emit('header.btn.change', {btn: 'search'});

        $controller('CommonController', {$scope: $scope});

        var parmas = angular.extend(SignService.get(), {
            ticketid: $stateParams.ticketid,
            ticketnum: $stateParams.ticketnum
        });

        $scope.loading.show();
        Order1Service.get(parmas, function (dt) {
            if (dt) {
                $scope.data = dt;

            }
            $scope.loading.hide();
        });

        $scope.tab = {
            selectTab: 0
        };

        $ionicModal.fromTemplateUrl('address-list.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.listmodal = modal;
        });

        $ionicModal.fromTemplateUrl('modal_add_address.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.addmodal = modal;
        });

        $scope.showAddressModal = function () {
            $scope.addresslist = $scope.data.revaddress;

            $scope.listmodal.show();
        };

        $scope.closeModal = function (modal) {
            $scope[modal].hide();
        };

        $scope.addressData = {};

        $scope.addAddressModal = function () {

            CityListService.query().then(function (dt) {
                $scope.title = '添加地址';
                $scope.citylist = dt.citylist;
                $scope.addmodal.show();
            });
        };

        $scope.doAddAdress = function () {

            var data = SignService.get();
            data.recaddress = $scope.addressData.province.p + $scope.addressData.city.n + $scope.addressData.addr;
            data = angular.extend(data, $scope.addressData);

            $scope.loading.show();

            AddressService.save(data, function (dt) {

                if (dt.error) {
                    alert(CONFIG.ERROR[dt.error]);
                } else {
                    //get address list
                    AddressService.list(SignService.get(), function (dt) {
                        if (dt.error) {
                            alert(CONFIG.ERROR[dt.error]);
                        } else {
                            $scope.addresslist = dt;
                            $scope.addressData = {};
                        }
                    });

                    $scope.closeModal('addmodal');
                }
                $scope.loading.hide();

            })
        };

    }])

    .controller('OrderCtrl', ['$scope', function ($scope) {
        $scope.$emit('header.btn.change', {btn: 'search'});
    }])

    .controller('SearchCtrl', ['$scope', function ($scope) {
//        $scope.$emit('header.btn.change', {btn: ''});

    }])

    .controller('PlaylistsCtrl', function ($controller, $scope, $rootScope, $stateParams, CONFIG, SignService, GetshowsService) {

        $controller('CommonController', {$scope: $scope});
        $scope.loading.show();

        $scope.$on('playlists.change', function (event, data) {
            console.log(data.filter);
        });

        var sign = SignService.get();

        sign.catid = $stateParams.id;

        $scope.data = {};

        GetshowsService.get(sign, function (dt) {
            if (dt.error) {
                alert(CONFIG.ERROR[dt.error]);
            } else {
                $scope.data = dt;
                $rootScope.title = $scope.data.catinfo.name;
            }
            $scope.loading.hide();
        }, function () {
            alert('服务出错了');
            $scope.loading.hide();
        });

        $scope.$emit('header.btn.change', {btn: 'filter'});
    })

    .controller('PlaylistCtrl', function ($scope, $controller, $stateParams, ItemService, SignService) {

        $scope.$emit('header.btn.change', {btn: 'share'});

        $controller('CommonController', {$scope: $scope});
        $scope.loading.show();

        var params = SignService.get();
        params = angular.extend(params, {id: $stateParams.id});

        ItemService.get(params, function (dt) {
            if (dt) {
                $scope.data = dt;
            }
            $scope.loading.hide();
        }, function () {
            $scope.loading.hide();
        })

    });
