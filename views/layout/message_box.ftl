<script type="text/ng-template" id="modal" ng-controller="RemodalAreaController">
	<div>
		<div class="modal-header">
			<button type="button" class="close" ng-click="onCancel()">
				<span aria-hidden="true">&times;</span>
			</button>
			<h1 ng-show="title">{{ title }}</h1>
			
		</div>
		<div class="modal-body">
			<div class="container">
				<div class="row">
					<p>{{ text }}</p>
				</div>
				
				<div ng-show="input" class="row">
					<div class="col-md-2 col-md-offset-2 input-group">
							<span class="input-group-addon" id="basic-addon1">{{ input.label }}</span>
							<input ng-model="inputData" type="number" min="{{ input.min }}" max="{{ input.max }}" required class="form-control" aria-describedby="basic-addon1">
						</div>
				</div>
			</div>
		</div>
		<div class="modal-footer">
			<button ng-show="style=='confirm'" ng-click="onCancel()" data-remodal-action="cancel" class="remodal-cancel">取消</button>
			<button ng-click="onOk(inputData)" data-remodal-action="confirm" class="remodal-confirm">确定</button>
		</div>
	</div>
</script>