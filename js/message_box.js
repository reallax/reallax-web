
/*
 * 构造函数，构造一个MessageBox对象。
 *
 * @param app AngularJS module对象
 */
function MessageBox(app) {
    Messenger.options = {
        extraClasses: 'messenger-fixed messenger-on-bottom',
        theme: 'flat'
    }

    this.app = app;

    var box = {};
    var boxTypeMap = {
        'info': 'info',
        'primary': 'info',
        'warning': 'error',
        'danger': 'error',
        'default': 'info',
        'success': 'success'
    };

    /*
     * 显示一条自定义内容的消息
     *
     * @param entry 一个消息Object
     *
     * {
     *     label: // 标签，可选值：'info', 'primary', 'warning', 'danger', 'default', 'success'
     *     title: // 标题文本 (可选)
     *     text:  // 消息文本
     *     buttons: [ // 按钮列表 (可选)
     *         {
     *             label: // 标签，可选值：'info', 'primary', 'warning', 'danger', 'default', 'success'
     *             text:  // 按钮文本
     *             click: // 点击按钮的回调函数
     *         }
     *     ]
     * }
     *
     */
    box.show = function (option) {
        var params = {
            message: option.text,
            type: boxTypeMap[option.label],
            showCloseButton: true,
            actions: option.buttons
        };

        Messenger().post(params);
    };

    /*
     * 显示一条消息，不带标题。
     *
     * @param label 消息标签，可选值：'info', 'primary', 'warning', 'danger', 'default'
     * 'success'
     * @param text  消息文本。
     */
    box.showText = function (label, text) {
        box.show({
            'label': label,
            'text': text
        });
    };

    /*
     * 显示一条消息，带标题。
     *
     * @param label 消息标签，可选值：'info', 'primary', 'warning', 'danger', 'default'
     * , 'success'
     * @param title 标题文本。
     * @param text  消息文本。
     */
    box.showTitleText = function (label, title, text) {
        box.show({
            'label': label,
            'text': text,
            'title': title
        });
    };

    this.app.factory('box', function(){
        return box;
    });

    return this;
}

function Remodal(app) {
	this.app = app;
	
	this.app.requires.push('ui.bootstrap');
	this.app.factory('remodal', function() {
		return {};
	});

	this.app.controller('RemodalAreaController', function($scope, $modal, remodal) {

		/*
		 * 现实对话框: remodal.show(option)
		 * @param option
		 * {
		 *     title: // 标题文本 (可选)
		 *     text:  // 消息文本
		 *     style: // 对话框风格（可选）
		 *            // 'ok': 只显示"确定"按钮，'confirm': 显示"确定" "取消"两个按钮；
		 *            // 'forceOk'：只显示"确定"按钮，且不显示关闭按钮。
		 *            // 默认为'confirm'
		 *     onOk: // 点击确认后的回调函数
		 *     onCancel: // 点击取消后(可选)
		 * }
		 */
		remodal.show = function(option, scope) {
			var modalInstance = $modal.open({
				templateUrl: 'modal',
				controller: 'confirmModalCtrl',
				size: 'md',
				resolve: {
					data: function() {
						return {
							option: option,
							scope: scope,
						};
					}
				}
			});
			
			modalInstance.result.then(option.onOk);
		};
	});

	this.app.controller('confirmModalCtrl',
		function($scope, $modalInstance, data) {
			$scope.title = data.option.title;
			$scope.text = data.option.text;
			if (typeof data.option.style === 'string' && data.option.style != '') {
				$scope.style = data.option.style;
			} else {
				$scope.style = 'confirm';
			}
			$scope.input = data.option.input;
			$scope.inputData = data.option.inputData;
			$scope.scope = data.scope;

			$scope.onOk = function(data) {
				$modalInstance.close(data);
			};

			$scope.onCancel = function() {
				$modalInstance.dismiss('cancel');
			};
		});
}

