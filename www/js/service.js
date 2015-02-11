/**
 * Created by admin on 2014/12/22.
 */
angular.module('starter.services', [])
    .constant('$ionicLoadingConfig', {
        template: '<i class="ion-loading-c" data-animation="true"></i>'
    })

    .constant('CONFIG', {
        KEY: 'PCJK-Ver1.0',
        HTTP_REMOTE_PERFIX: 'http://www.piaochong.com/wapapi',
        ERROR: {
            1: '未登录',
            2: '签名错误',
            13: '您的账号不存在！',
            14: '您的密码不正确！',
            15: '您的账号已被禁用，请联系客服处理',
            16: '两次密码输入不一致',
            17: '账号只能是手机号或者email',
            18: '该账号已被注册',
            19: '未知错误，请重试',
            20: '非法操作,非正常步骤进入',
            21: '操作超时，验证码失效',
            22: '验证码已过时失效，请重试',
            23: '验证码输入错误',
            24: '验证码不能为空',
            25: '地址id不能为空',
            26: '该收获地址不存在',
            27: '该收获地址不存在', //该收获地址不存在 无权限操作别人的收货地址
            31: '旧密码不能为空且长度为4~16位',
            32: '新密码不能为空且长度为4~16位',
            33: '确认密码与新密码不一致',
            34: '新密码与原密码不能一致',
            35: '原密码输入不正确',
            56: '收货人姓名长度为3-20位',
            58: '手机号格式不正确',
            60: '收货地址长度为10-100位',
            61: '邮编只允许输入数字',
            888: '',
            999: '服务出错了,请稍后重试'
        }
    })

    .service('CityListService', ['$http', '$cacheFactory', '$q', function ($http, $cacheFactory, $q) {
        var url = 'lib/city/city.json';
        var service = {
            query: function () {
                var defer = $q.defer();
                $http({
                    method: 'GET',
                    url: url,
                    cache: function () {
                        return $cacheFactory('CityList');
                    }
                }).success(function (data) {
                    defer.resolve(data);
                    return service.citylist = data;
                }).error(function (err) {
                    defer.reject(err)
                });
                return defer.promise;
            }
        };
        return service;
    }])

    .factory('SignService', ['CONFIG', function (CONFIG) {
        return {
            get: get
        };
        function get(time) {
            time = time || Date.now() || 1394812023;
            time = Math.floor(time/1000);
            var sign = hex_md5(CONFIG.KEY + "_" + time).substr(6, 18);

            //fixme for test
            sign = 'c1968dea4843e6446b';
            time = '1394812023';

            return {sign: sign, time: time};
        }

    }])

    .service('LoginService', ['$resource', 'CONFIG', function ($resource, CONFIG) {

        return $resource(CONFIG.HTTP_REMOTE_PERFIX + '/:url', {}, {
            islogin: {
                method: 'GET',
                params: {
                    url: 'islogin.do',
                    sign: '@sign',
                    time: '@time'
                }
            },
            login: {
                method: 'POST',
                params: {
                    url: 'login.do',
                    sign: '@sign',
                    time: '@time'
                }
            },
            logout: {
                method: 'GET',
                params: {
                    url: 'logout.do',
                    sign: '@sign',
                    time: '@time'
                }
            },
            reg: {
                method: 'POST',
                params: {
                    url: 'reg.do',
                    sign: '@sign',
                    time: '@time'
                }
            },
            //找回密码
            findpwd: {
                method: 'POST',
                params: {
                    url: 'findpwd.do',
                    sign: '@sign',
                    time: '@time'
                }
            },
            //重设密码
            resetpwd: {
                method: "POST",
                params: {
                    url: 'resetpwd.do',
                    sign: '@sign',
                    time: '@time'
                }
            },
            //修改密码
            modpwd: {
                method: 'POST',
                params: {
                    url: 'modpwd.do',
                    sign: '@sign',
                    time: '@time'
                }
            }

        })
    }])

    //收货地址 GET
    .factory('AddressService', ['$resource', 'CONFIG', function ($resource, CONFIG) {
        return $resource(CONFIG.HTTP_REMOTE_PERFIX + '/:url', {}, {
            list: {
                method: 'GET',
                isArray: true,
                params: {
                    url: 'myaddress.do'
                }
            },
            //删除收货地址 GET
            //@param {Number} id ,地址id
            delete: {
                method: 'GET',
                params: {
                    url: 'deladdress.do'
                }
            },
            save: { //id 如果是修改以保存的地址就有 否则就是新添
                method: 'GET',
                params: {
                    url: 'saveaddress.do'
                }
            },
            moda: {
                method: 'POST',
                params: {
                    url: 'modaddress.do'
                }
            },
            //设置默认收货地址 id,isdef
            setdef:{
                method:'GET',
                params:{
                    url:'setdefaddress.do'
                }
            }
        })
    }])

    //演出城市 GET
    .factory('AllcitysService', ['$resource', 'CONFIG', function ($resource, CONFIG) {
        return $resource(CONFIG.HTTP_REMOTE_PERFIX + '/allcitys.do', {}, {})

    }])

    //演出分类 GET
    .factory('AllcatsService', ['$resource', 'CONFIG', function ($resource, CONFIG) {
        return $resource(CONFIG.HTTP_REMOTE_PERFIX + '/allcats.do', {}, {})

    }])

    //根据分类获取演出 GET
    .factory('GetshowsService', ['$resource', 'CONFIG', function ($resource, CONFIG) {
        return $resource(CONFIG.HTTP_REMOTE_PERFIX + '/getshows.do', {}, {
            query: {
                method: 'GET',
                isArray: true
            }
        });

    }])
    //获取首页幻灯片
    .factory('HdpicService', ['$resource', 'CONFIG', function ($resource, CONFIG) {
        return $resource(CONFIG.HTTP_REMOTE_PERFIX + '/hdpic.do', {}, {
            query: {
                method: 'GET',
                isArray: true
            }
        })
    }])
    //获取首页排行榜
    .factory('HrankService', ['$resource', 'CONFIG', function ($resource, CONFIG) {
        return $resource(CONFIG.HTTP_REMOTE_PERFIX + '/hrank.do', {}, {})

    }])

    //获取已付款 未付款的订单
    .factory('MyticketService', ['$resource', 'CONFIG', function ($resource, CONFIG) {
        return $resource(CONFIG.HTTP_REMOTE_PERFIX + '/myticket.do', {}, {
            get: {
                method: 'GET',
                params: {
                    pnum: 5 //每页多少条
                }
            }
        })

    }])

    //根据项目id获取演出详情
    .factory('ItemService', ['$resource', 'CONFIG', function ($resource, CONFIG) {
        return $resource(CONFIG.HTTP_REMOTE_PERFIX + '/item.do', {}, {})

    }])

    .factory('TicketService', ['$resource', 'CONFIG', function ($resource, CONFIG) {
        return $resource(CONFIG.HTTP_REMOTE_PERFIX + '/ticket.do', {}, {})

    }])
    //order1
    .factory('Order1Service', ['$resource', 'CONFIG', function ($resource, CONFIG) {
        return $resource(CONFIG.HTTP_REMOTE_PERFIX + '/order1.do', {}, {})

    }])
    //order2
    .factory('Order2Service', ['$resource', 'CONFIG', function ($resource, CONFIG) {
        return $resource(CONFIG.HTTP_REMOTE_PERFIX + '/order2.do', {}, {})

    }])

    .factory('Service', ['$resource', 'CONFIG', function ($resource, CONFIG) {
        return $resource(CONFIG.HTTP_REMOTE_PERFIX + '', {}, {})

    }])

