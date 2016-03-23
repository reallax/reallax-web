
var app = angular.module('MetronicApp');
var _ = new Remodal(app);

app.controller('configController', function ($scope, $http, $rootScope, $location, remodal) {
    //清空所有的浏览器本地缓存
    $scope.appId = "435ED65AC87971";
    var appId = $scope.appId;

    var appConfig = {};
	$scope.moduleDisable = {};

	$scope.currentRole = '';//假定当前用户的角色默认为开发者
	$scope.editScriptMenu = '编辑';
	
	var globeAppCopy = {};
    
    $scope.appConfig = appConfig;
            var appRandId = randomString(6);
            appConfig["rId"] = appRandId;

            var appModuleConfig = {};
            appModuleConfig["name"] = ""
            var randId = randomString(6);
            appModuleConfig["rId"] = randId;
            appModuleConfig["replaceWithModuleTemplate"] = false;
            var appModules = appConfig["appModules"]
            if (appModules == null) {
                appModules = [];
                appConfig["appModules"] = appModules

            }
            initAction(appModuleConfig)
            initEnv(appModuleConfig)
            appModules.push(appModuleConfig);
            copyGlobeApp();

    
    /**
     * 初始化不同模块和环境host的展示
     * @param appConfig
     */
    function initEnvDataForBackend(appConfig) {
        var appModules = getAppModuleFromApp(appConfig)
        var mSize = appModules.length;
        if (appModules == null || mSize < 1) {
            return
        }
        for (var i = 0; i < mSize; i++) {
            var envs = appModules[i]["envs"]
            if (envs == null || envs.length < 1)return

            for (var j = 0; j < envs.length; j++) {

                transferEnv(envs[j])

            }

            var language = appModules[i].language;
			if(language == "Java" || language == "Golang" ) {
				appModules[i].gitShow = false;
			} else {
				appModules[i].gitShow = true;
			}


        }
    }

    function getAppModuleFromApp(appConfig) {
        var appModules = appConfig["appModules"]
        if (appModules == null) {
            appModules = [];
            appConfig["appModules"] = appModules

        }

        return appModules
    }

    /**
     * 获取当前URL参数值
     * @param name    参数名称
     * @return    参数值
     */
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null)
            return unescape(r[2]);
        return null;

    }

    //增加模块
    $scope.addAppModule = function () {
        var appModuleConfig = {};
        initAction(appModuleConfig)
        initEnv(appModuleConfig)
        var randId = randomString(6);
        appModuleConfig["rId"] = randId;
        appModuleConfig["replaceWithModuleTemplate"] = false;

        var appModules = appConfig["appModules"]
        if (appModules == null) {
            appModules = [];
            appConfig["appModules"] = appModules;
        }
        appModules.push(appModuleConfig);
    }
    //保存当前模块 + 更新与应用的关联关系
    $scope.saveAppModule = function(index) {
    	alert("模块保存事件！！");
    }

    function pickOneModule(appConfig, index) {
    	var singleModule = appConfig.appModules[index];
    	var moduleList = new Array();
    	moduleList.push(singleModule);
    	var app = {
    		id:appConfig.id,
    		name:appConfig.name,
    		description:appConfig.description,
    		createTime:appConfig.createTime,
    		appModules:moduleList
    	}
    	return app;
    }

    //保存单个应用模块
    function postAppSigleModule(saveSample, index, log) {
        $http.post("/gatApp", {app:saveSample,oneModuleSave:true,operateDetail:log}, {headers: {'Content-Type': 'application/json'} })
            .then(function (response) {
                console.log(response);
                var result = response.data;
                if (result.code == 0) {
//                  window.opener.location.href = window.opener.location.href;
//                  window.close();
                    //保存id
                    saveSample = result.data;
                    assignId(saveSample, index);
        			box.showText('info', '模块[' + $scope.appConfig.appModules[index].name + ']保存成功!');
                }
                else {
                    if(isNotEmpty(result.message)){
                        box.showText('danger', '保存失败 原因:'+result.message+' 请关闭本页面，稍后再试!');
                    }else{
                        box.showText('danger', '保存失败!请关闭本页面，稍后再试!');
                    }
                }

                var module = $scope.appConfig.appModules[index];
                var allEnv = module.envs;
                //载入原有各环境信息到多行文本框
                for (var j = 0; j < allEnv.length; j++) {
                   transferEnv(allEnv[j]);
                }
            });
    }

    function assignId(saveSample, index) {
    	var copyModule = saveSample.appModules[index];
    	var module = $scope.appConfig.appModules[index];
    	$scope.appConfig.id = saveSample.id;	//应用id
    	$scope.appConfig.createTime = saveSample.createTime;
    	module.id = copyModule.id;	//模块id
    	//action id
    	var foreActions = module.actions;
    	var backActions = copyModule.actions;
    	if(foreActions != null) {
    		var len1 = foreActions.length;
	    	for(var i=0; i<len1; i++) {
	    		foreActions[i].id = backActions[i].id;
	    	}
    	}

    	//config id
    	var foreConfs = module.configs;
    	var backConfs = copyModule.configs;
    	if(foreConfs != null) {
	    	var len2 = foreConfs.length;
	    	for(var i=0; i<len2; i++) {
	    		foreConfs[i].id = backConfs[i].id;
	    	}
    	}

    	setGitShow(module);
    }

    function setGitShow(module) {
    	var language = module.language;
		if(language == "Java" || language == "Golang" ) {
			module.gitShow = false;
		} else {
			module.gitShow = true;
		}
    }

    //删除当前模块 + 更新与当前应用的关联关系 
    $scope.delAppModule = function (index) {
        remodal.show({
            title:'应用管理',
            text: '是否要删除此模块？删除后点击保存，将无法恢复',
            onOk: function() {
                realDeleteAppModule(index)
            }
        });
    }

    function realDeleteAppModule(index){
        var appModules = getAppModuleFromApp($scope.appConfig)
        //
        if (appModules == null) {
            appModules = []
        }

        var appModuleD=appModules[index]

        var isDelByBackEnd=false
        if(appModuleD!=null&&isNotEmpty(appModuleD.id)){
            isDelByBackEnd=true
        }

        if(!isDelByBackEnd){
            appModules.splice(index, 1);
        }
    }

    function testScriptStoreLocalStorage(actionId) {
        var userId = getUserId()
        var key = userId + ":" + actionId

        var value = {
            appId: "",
            appModuleId: "",
            script: {
                name: "test.sh",

                codeString: "host"
            }

        }
        localStorageService.set(key, value);
    }

    /**
     *存储脚本与scritpt页面进行交互
     * @param actionId
     * @param actions为action的兄弟节点，为了避免编辑的时候出现同意模块下的脚本兄弟重名的状况
     */
    function scriptStoreLocalStorage(actionId,script,actions) {
        var userId = getUserId()
        var key = userId + ":" + actionId

        var value = {
            appId: "",
            appModuleId: "",
            actions:actions,
            script:script

        }
        localStorageService.set(key, value);
    }

    function getScriptLocalStorage(actionId) {
        var userId = getUserId()
        var key = userId + ":" + actionId
        var value=localStorageService.get(key);
        if(value==null||typeof(value)=="undefined"){
            return null;
        }

        return value.script
    }

    /**
     * 初始化过程
     * @param appModuleConfig
     */
    function initAction(appModuleConfig) {
        var actions = appModuleConfig["actions"]
        if (actions == null) {
            actions = []
            appModuleConfig["actions"] = actions
        }
        var randId = randomString(6)
        var action = {index: 1, runAs:"webuser",name: "更新文件", rId: randId}
        actions.push(action)

        randId = randomString(6)
        action = {index: 2,  runAs:"webuser",name: "更新配置", rId: randId}
        actions.push(action)

        randId = randomString(6)
        action = {index: 3, runAs:"webuser", name: "重启进程", rId: randId}
        actions.push(action)

        randId = randomString(6)
        action = {index: 4,  runAs:"webuser",name: "清理垃圾", rId: randId}
        actions.push(action)

        randId = randomString(6)
        action = {index: 5,  runAs:"webuser",name: "检查部署", rId: randId}
        //testScriptStoreLocalStorage(randId)
        actions.push(action)

    }

    /**
     * 初始化每个模块的环境
     * @param appModuleConfig
     */
    function initEnv(appModuleConfig) {
        var envs = appModuleConfig["envs"]
        if (envs == null) {
            envs = []
            appModuleConfig["envs"] = envs
        }
        var env = {env:0,name: "测试环境"}
        envs.push(env)

        env = {env:1,name: "预发环境"}
        envs.push(env)

        env = {env:2,name: "线上环境"}
        envs.push(env)


    }


    //增加过程
    $scope.addAction = function (newAction, index) {

        if (newAction == null || newAction == "") {
            alert("过程名不能为空");
            return;
        }
        var appModuleConf = appConfig["appModules"][index]
        var actions = appModuleConf["actions"]
        if (actions == null) {
            actions = []
            appModuleConf["actions"] = actions
        }
        var indexValue = actions.length + 1

        randId = randomString(6)
        action = {index: indexValue,runAs:"webuser", name: newAction, rId: randId}
        actions.push(action)
        //添加action时记录日志
		var copyaction = angular.copy(action);
		copyaction["add"] = true;
    }

    function getModule(index) {
        var appModuleConf = appConfig["appModules"][index]
        return appModuleConf;
    }
    //将过程提前
    $scope.forwardAction = function (appModuleConfig, index) {

        if (index == 1)return;
        var actions = appModuleConfig["actions"]
        if (actions == null) {
            actions = []
            appModuleConfig["actions"] = actions
        }

        var indexValue = actions.length
        var currentAction = actions[index - 1]
        actions[index - 1] = actions[index - 2]
        actions[index - 2] = currentAction
        currentAction["index"] = index - 1
        actions[index - 1]["index"] = index
    }
    //将过程推后
    $scope.backAction = function (appModuleConfig, index) {
        var actions = appModuleConfig["actions"]
        if (actions == null) {
            actions = []
            appModuleConfig["actions"] = actions
        }

        var indexValue = actions.length
        if (index >= indexValue)return;
        var currentAction = actions[index - 1]
        actions[index - 1] = actions[index]
        actions[index] = currentAction
        currentAction["index"] = index + 1
        actions[index - 1]["index"] = index
    }
    //删除过程，保存时才真实删除，否则会逻辑混乱
    $scope.deleteAction = function (appModuleConfig, index) {
        remodal.show({
            title:'应用管理',
            text: '是否要删除此过程？会对其脚本以及元数据进行删除,将无法恢复',
            onOk: function() {

                realDeleteAction(appModuleConfig,index)
                //删除action时记录

            }
        });
    }

    function realDeleteAction(appModuleConfig, index){
        var actions = appModuleConfig["actions"]
        if (actions == null) {
            actions = []
            appModuleConfig["actions"] = actions
        }

        var actionD=actions[index]

        if(actionD!=null&&isNotEmpty(actionD.id)){
            var actionId=actionD.id
            var appModuleId=appModuleConfig.id
            var appId=$scope.appConfig.id
            var scriptId=null
            if(actionD.scripts!=null&&actions.length>0){
                scriptId=actionD.scripts[0].id
            }
        }
		actions.splice(index, 1);
    }

    function refresh(){
        $scope.$apply(function(){
                $scope.appConfig = $scope.appConfig
            }
        )
    }

    /**
     * 到后台删除已经
     * @param appModuleId
     * @param actionId
     */
    function deleteActionForBackend(appId,appModuleId,actionId,index,actions) {

        $http.delete("/action/"+actionId, {"params": {'appId':appId,'appModuleId': appModuleId }})
            .success(function(response) {

                console.log(response);
                var result = response
                if (result.code == 0) {

                    actions.splice(index, 1);
                    refresh()
                    box.showText('danger', '后台删除成功');
                }
                else {
                    box.showText('danger', '删除失败');
                }


        }).error(function() {
                box.showText('danger', '删除出现异常');        });
    }
    //到选择模板页面
    $scope.useSciptTemplate = function () {
		alert("选择模板事件！！");
    }
    function getQueryParaUrl(appId, appRid, appModuleId, appModuleRid, actionId, actionRid) {
        var appParaId = appRid
        var appModuleParaId = appModuleRid
        var actionParaId = actionRid
        if (isNotEmpty(appId)) {
            appParaId = appId
        }
        if (isNotEmpty(appModuleId)) {
            appModuleParaId = appModuleId
        }
        if (isNotEmpty(actionId)) {
            actionParaId = actionId
        }
        return getQueryPara(appParaId, appModuleParaId, actionParaId)

    }

    function getQueryPara(appId, appModuleId, actionId) {
        return "appId=" + appId + "&appModuleId=" + appModuleId + "&actionId=" + actionId
    }
    //到编辑模板页面
    $scope.editScipt = function () {
    	alert("编辑脚本事件！！");
    }



    $scope.setRunasUser=function(currentModule,action,runAs){
        action.runAs=runAs;
    }
    /**
     * 检查配置，删除不必要字段，调整数据结构,否则，无法提交,
     * @param appModuleConf
     * @returns {boolean}
     */
    function checkAppModuleConf(appModuleConf) {

        if (appModuleConf["name"] == null || appModuleConf["name"] === "") {
            box.showTitleText("danger", "错误", "模块名不能为空")
            return false
        }

        if (appModuleConf["language"] == null || appModuleConf["language"] === "") {
            box.showTitleText("danger", "错误", "模块类型不能为空")
            return false
        }

        var language = appModuleConf["language"];
        if(language == "Java" || language == "Golang" ) {
        	appModuleConf["codeRepertoryURL"] = "";
        } else {
        	if(appModuleConf["codeRepertoryURL"] == null || trim(appModuleConf["codeRepertoryURL"]) === "") {
        		box.showTitleText("danger", "错误", language + "语言git地址不能为空");
        		return false;
        	}
        }

//        var envTest = appModuleConf["envTest"]
//        appModuleConf["envTest"]
//
//        var envPrd = appModuleConf["envPrd"]
//        appModuleConf["envPrd"]
//
//        var envStg = appModuleConf["envStg"]
//        appModuleConf["envStg"]
//
//        dealEnv(envTest)
//        dealEnv(envStg)
//        dealEnv(envPrd)

        var actions = appModuleConf["actions"]
        if (actions == null || actions.length < 1) {
            box.showTitleText("danger", "错误", "至少定义一个过程")
            return false
        }

        for (var i = 0; i < actions.length; i++) {
            var actionCheckResult=checkAction(actions[i])
            if(!actionCheckResult){
                return actionCheckResult
            }
        }



        var configs = appModuleConf["configs"]

        if(configs==null)return;

		var pathNames = [];
        for (var i = 0; i < configs.length; i++) {
            if(!checkConfig(configs[i])){
                return false;
            }
            if(!checkConfPath(pathNames, configs[i])) {
            	box.showTitleText('danger', '错误', '模块['+appModuleConf.name+'],配置文件['+configs[i].name+']路径重复：'+configs[i].path+'。请修改！');
            	return false;
            }
        }
        return true

    }

    function dealEnv(envIps) {

    }

    function getUserId() {
        var defaultUserId = 1;
        return defaultUserId
    }

    function checkAction(action) {
        if (action["name"] == null || action["name"] == "") {
            box.showTitleText("danger", "错误", "过程不能为空")
            return false
        }
        var id = action.id
        if (!isNotEmpty(id)) {
            id = action.rId
        }

        var userId = getUserId()

        var actionEdit = getActionConfigFromLocalCache(userId, id)
        if (actionEdit != null && actionEdit.script!=null) {
            var script = actionEdit.script;
            var scripts = action.scripts
//            if (scripts == null) {
//                action.scripts = scripts = []
//            }
            //第一版 一个过程只是对应一个模板
            action.scripts = scripts = []
            scripts.push(script)
        }

        console.log(action)
        return true
    }

    function checkConfig(config) {
        if (config["name"] == null || config["name"] == "") {
            box.showTitleText("danger", "错误", "配置名不能为空")
            return false
        }
        console.log(config)
        return true
    }
    
     function checkConfPath(pathNames, config) {
    	var pathName = config.path;
    	var len = pathNames.length;
    	for(var i=0; i<len; i++) {
    		if(pathNames[i] == pathName) {
    			return false;
    		}
    	}
    	pathNames.push(pathName);
    	return true;
    }

    function getActionConfigFromLocalCache(userId, actionId) {
        var key = userId + ":" + actionId
        return localStorageService.get(key)
    }

    //删除所有后台不需要的id和index属性
    function clearId(appConfig)
    {
    	delete appConfig["rId"];
    	var appModuleConfs = appConfig["appModules"];
    	var appModuleConf;
    	var actions;
    	var action;
    	var configs;
    	var config;
    	for (var i = 0; i < appModuleConfs.length; i++) {
    		appModuleConf = appModuleConfs[i];
    		delete appModuleConf["rId"];
    		actions = appModuleConf["actions"];
    		for (var j = 0; j < actions.length; j++) {
    			action = actions[j];
    			delete action["index"];
    	        delete action["rId"];
    		}
    		configs = appModuleConf["configs"];
    		if(configs == null)
    			continue;
    		for (var k = 0; k < configs.length; k++) {
    			config = configs[k];
    			delete config["rId"];
    		}
    	}
    }

    function clearGitShow(appConfig) {
    	var appModuleConfs = appConfig["appModules"];
        for (var i = 0; i < appModuleConfs.length; i++) {
            delete appModuleConfs[i]["gitShow"];
        }
    }

    $scope.saveAppConfig = function () {
    	alert("应用保存事件！！");
    }


    /**
     * 初始化不同模块和环境host的展示
     * @param appConfig
     */
    function transferEnvsForPost(appConfig) {
        var appModules = getAppModuleFromApp(appConfig)
        var mSize = appModules.length;
        if (appModules == null || mSize < 1) {
            return
        }
        for (var i = 0; i < mSize; i++) {
            var envs = appModules[i]["envs"]
            if (envs == null || envs.length < 1)return

            for (var j = 0; j < envs.length; j++) {

                transferEnvDataForPost(envs[j])

            }

        }
    }

    function transferEnvDataForPost(env) {
        if (env == null)return
        var hostNames = env["hostNames"]
        delete env["hostNames"]

        var hosts = []
        env["hosts"] = hosts

        if (hostNames == null || hostNames == "" || trim(hostNames) === "")return


        var ips = hostNames.split("\n");
        for (var i = 0; i < ips.length; i++) {
            var ip = ips[i];
            if (isNotEmpty(ip)) {
                var host = {"serviceIp": ip}
                hosts.push(host)
            }

        }
    }

    function isNotEmpty(str) {
        if (str == null || str === "" || trim(str) === "")return false
        return true
    }

    function trim(str) {
        return str.replace(/^(\s|\u00A0)+/, '').replace(/(\s|\u00A0)+$/, '');
    }


    function postAppConfiguration(log) {
        appConfig = $scope.appConfig
        $http.post("/gatApp", {app:appConfig, oneModuleSave:false, operateDetail:log}, {headers: {'Content-Type': 'application/json'} })
            .then(function (response) {
                console.log(response);
                var result = response.data
                if (result.code == 0) {
                    window.opener.location.href = window.opener.location.href;
                    window.close();
                }
                else {
                    if(isNotEmpty(result.message)){
                        box.showText('danger', '保存失败 原因:'+result.message+' 请关闭本页面，稍后再试!');
                    }else{
                        box.showText('danger', '保存失败!请关闭本页面，稍后再试!');
                    }
                    var modules = appConfig["appModules"];
                    for(var i = 0; i < modules.length; i++)
                    {
                    	var allEnv = modules[i].envs;
                    	//载入原有各环境信息到多行文本框
                    	for (var j = 0; j < allEnv.length; j++) {
                    		transferEnv(allEnv[j]);
                    	}
                    }
                }

            });
    }

    //增加config
    $scope.addConfig = function (newConfig, index) {

        if (newConfig == null || newConfig == ""||newConfig.length>=10) {
            alert("配置名不能为空或者过长(最大长度9)")
            return;
        }
        var appModuleConf = appConfig["appModules"][index]
        var configs = appModuleConf["configs"]
        if (configs == null) {
            configs = []
            appModuleConf["configs"] = configs
        }

        randId = randomString(6)
        config = {name: newConfig, rId: randId,path:"xxxPath"}
		appModuleConf.configs.push(config);
    }

    $scope.editConfig=function(appModuleConf,appConfigId,appConfigRid){
        alert("配置文件编辑事件！！");
    }

    $scope.delConfig=function(appModule,configId,configRid){
        realDeleteConfig(appModule,configId,configRid);
    }

    function realDeleteConfig(appModule,configId,configRid){
        var configs = appModule.configs

        var config=null;
        var index=-1;
        for(var i=0;i<configs.length;i++){
        	var id = configs[i].id;
        	var compareId = configId;
        	if(id == undefined || id == null || id == "") {
        		id = configs[i].rId;
        		compareId = configRid;
        	} 
            if(compareId == id){
                config=configs[i]
                index=i
                break;
            }
        }
        if(config==null)return;

		configs.splice(index, 1)
    }



    /**
     * 到后台删除已经
     * @param appModuleId
     * @param actionId
     */
	$scope.languageChanged = function(index) {
		var language = appConfig["appModules"][index].language;
		if(language == "Java" || language == "Golang" ) {
			appConfig["appModules"][index].gitShow = false;
		} else {
			appConfig["appModules"][index].gitShow = true;
		}
	}

	$scope.moveModule = function(index) {
	}

	var appConfig;
	var isEdit = false;
	var currentAppModuleName;
	var currentAppModuleId;
	var currentEnvOfAppModule;
    var currentOldSequenceNumber;

	function fillHostsByHostNames(env)
	{
		if(env != null)
		{
			var hostNames = env["hostNames"];

	        var hosts = [];
	        env["hosts"] = hosts;

	        if (hostNames != null && hostNames != "")
	        {
	        	hostNames = $.trim(hostNames);
	        	var ips = hostNames.split("\n");
		        for (var i = 0; i < ips.length; i++) {
		            var ip = ips[i];
		            if (null != ip && '' != ip) {
		            	ip = $.trim(ip);
		                var host = {"serviceIp": ip};
		                hosts.push(host);
		            }
		        }
	        }
		}
	}

    $scope.selectModuleTemplate = function(index){
    	
    	remodal.show({
            title:'模板现在',
            text: '做你想做的事情！',
            onOk: function() {
                //TODO
            }
        });
    };

	//变量拷贝,清除action，清除config
    function copyGlobeApp() {
        globeAppCopy = angular.copy($scope.appConfig);
        var modules = getAppModuleFromApp(globeAppCopy);
        for(var i=0; i<modules.length; i++) {
        	modules[i].actions = [];
        	modules[i].configs = [];
        }
    }
	function copyModuleToAppCopy(module){
		if (globeAppCopy == null) {
			copyGlobeApp();
		}else{
			var index = findModuleIndex(module);
			if(index != null) {
				moduleCopy = angular.copy(module);
				moduleCopy.actions = [];
	        	moduleCopy.configs = [];
				getAppModuleFromApp(globeAppCopy)[index]= moduleCopy;
			}
		}
	}
	function findModuleIndex(module) {
		var id = module.id;
		var rId = module.rId;
		var modules = getAppModuleFromApp(globeAppCopy);
		if(id == undefined) {
			id = "";
		}
		if(id == null || id === "") {
			for(var i=0; i<modules.length; i++) {
				if(isNotEmpty(modules[i].rId) && isNotEmpty(rId) && modules[i].rId == rId) {
					return i;
				}
			}
		} else {
			for(var i=0; i<modules.length; i++) {
				if(isNotEmpty(modules[i].id) && isNotEmpty(id) && modules[i].id == id) {
					return i;
				}
			}
		}
		//通过模块名称查找（增加一个模块时，副本里面只有rId）
		for(var i=0; i<modules.length; i++) {
				if(modules[i].name == module.name) {
					return i;
				}
		}
		return null;
	}
	
	function getGlobeCopyModule(module) {
		var mindex = findModuleIndex(module);
		var copyModule = null;
		if(mindex != null) {
			copyModule = getAppModuleFromApp(globeAppCopy)[mindex];
		}
		if(copyModule == null) {
			console.info("editConfigEvent() find copyModule is null!");
			return null;
		}
		return copyModule;
	}
	
	$scope.editConfigEvent = function(module, config) {
		//如果configid不为空，就代表新增，否则是编辑
		var mindex = findModuleIndex(module);
		var copyModule = null;
		if(mindex != null) {
			copyModule = getAppModuleFromApp(globeAppCopy)[mindex];
		}
		if(copyModule == null) {
			console.info("editConfigEvent() find copyModule is null!");
			return;
		}
		var cindex = findConfigIndex(copyModule, config);
		if(cindex == null) {	//添加到副本
			var copyConfig = angular.copy(config);
			copyConfig["modify"] = true;
			copyModule.configs.push(copyConfig);
		} else {
			copyModule.configs[cindex]["modify"] = true;
			//根据id == null判断是否是新增 TODO
		}
	}
	function deleteConfigEvent(module, config) {
		//如果configid不为空，就代表新增，否则是编辑
		var mindex = findModuleIndex(module);
		var copyModule = null;
		if(mindex != null) {
			copyModule = getAppModuleFromApp(globeAppCopy)[mindex];
		}
		if(copyModule == null) {
			console.info("deleteConfigEvent() find copyModule is null!");
			return;
		}
		var cindex = findConfigIndex(copyModule, config);
		if(cindex == null) {	//添加到副本
			var copyConfig = angular.copy(config);
			copyConfig["delete"] = true;
			copyModule.configs.push(copyConfig);
		} else {
			var copyConfig = copyModule.configs[cindex];
			if(copyConfig.id == undefined || copyConfig.id == null || copyConfig.id ==="") {
				copyModule.configs.splice(cindex, 1);
			} else {
				copyConfig["delete"] = true;
			}
		}
	}
	function findConfigIndex(copyModule, config) {
		var cindex = null;
		var configs = copyModule.configs;
		if(configs == null) return null;
		var id = config.id;
		var rId = config.rId;
		if(id == undefined || id == null || id == "") {
			for(var i=0; i<configs.length; i++) {
				if(configs[i].rId == rId) {
					return i;
				}
			}
		} else {
			for(var i=0; i<configs.length; i++) {
				if(configs[i].id == id) {
					return i;
				}
			}
		}
		return null;
	}
	
	//通过模块的Id或Rid查找Module
	function queryModuleByRId(appmodule){
		for(var i=0; i<$scope.appConfig.appModules.length; i++){
			var module = $scope.appConfig.appModules[i];
			if(module.id == appmodule.id || module.rId == appmodule.id){
				return module;
			}
		}
		return null;
	}
	
	//通过模块和模块的Action的Id（rId）查询Action,action的id可能为rId
	function queryActionByRId(module, action){
		for(var i=0; i<module.actions.length; i++){
			var appAction = module.actions[i];
			if(appAction.id != null && appAction.id == action.id){
				return appAction;
			}
			if (appAction.rId != null && (appAction.rId == action.id || appAction.rId == action.rId)) {
				return appAction;
			}
		}
		return null;
	}
	
});
	//-------------add by chent end---------------------

/**
 * 页面展示用，在保存时需要删除不必要字段，这样才能与后台进行交互
 * @param env
 */
function transferEnv(env) {
    if (env == null)return
    env["hostNames"] = ""
    var hosts = env["hosts"]
    if (hosts == null || hosts.length < 1)return

    for (var i = 0; i < hosts.length; i++) {
        if(i==0){
            env["hostNames"]= hosts[i].serviceIp
        }else{
            env["hostNames"] = env["hostNames"] + "\n" + hosts[i].serviceIp
        }
    }
}

function randomString(len) {
    len = len || 32;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    var maxPos = $chars.length;
    var pwd = '';
    for (i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos))
    }
    var timestamp = new Date().getTime();
    pwd += timestamp
    return pwd;

}

