var N = 25;
var GAP = 25;
var it = 0;
var MAP_RADIUS_0 = 175;
var LR_0 = 0.3;
var LAMBDA = 50;

function init_feature_map(){
	var output = [];
	for(var i=0; i<N*GAP; i+=GAP){
		for(var j=0; j<N*GAP; j+=GAP){
			output.push([50+i,50+j]);
		}
	}
	return output.concat();
}

function euclidean_distance(point_a, point_b){
	var aa = point_a[0]-point_b[0];
	var bb = point_a[1]-point_b[1];
	return Math.sqrt(aa*aa+bb*bb);
}

function update_map(feature_map, input){
	
	// STEP 1
	var min_val = 9999999999.9;
	var winner = -1;
	for(var i in feature_map){
		var this_val = euclidean_distance(feature_map[i], input);
		if(this_val < min_val){
			min_val = this_val;
			winner = i;
		}
	}
	
	// STEP 2
	it = it + 1; console.log("iteration: "+it);
	var sigma = MAP_RADIUS_0*Math.exp(-(it/LAMBDA)); console.log("sigma: "+sigma);
	
	// STEP 3
	var lr = LR_0*Math.exp(-(it/LAMBDA)); console.log("learning rate: "+lr);
	for(var i in feature_map){
		if(i==winner)
			continue;
		var this_dist = euclidean_distance(feature_map[winner], feature_map[i]);
		if(this_dist <= sigma){	
			var theta = Math.exp(-((this_dist*this_dist)/(2*sigma*sigma))); //console.log("theta: "+theta);
			feature_map[i][0] = feature_map[i][0] + theta*lr*(input[0]-feature_map[i][0]);
			feature_map[i][1] = feature_map[i][1] + theta*lr*(input[1]-feature_map[i][1]);
		}
	}
	feature_map[winner][0] = feature_map[winner][0] + lr*(input[0]-feature_map[winner][0]);
	feature_map[winner][1] = feature_map[winner][1] + lr*(input[1]-feature_map[winner][1]);
	
	return feature_map.concat();
}

function draw_map(feature_map, elem, trained_points){
	var ctx = elem.getContext("2d");
	ctx.clearRect(0, 0, elem.width, elem.height);
	
	for(var i=0; i<N*N; i++){
		ctx.fillStyle = "#ff2626";
		ctx.beginPath();
		ctx.arc(feature_map[i][0], feature_map[i][1], 5, 0, Math.PI * 2, true);
		ctx.fill();
	}
	
	for(var i=0; i<N*N-N; i+=N){
		for(var j=0; j<N; j++){
			if(j!=N-1){
				ctx.beginPath();
				ctx.moveTo(feature_map[i+j][0],feature_map[i+j][1]);
				ctx.lineTo(feature_map[i+j+1][0],feature_map[i+j+1][1]);
				ctx.closePath();
				ctx.stroke();
				ctx.beginPath();
				ctx.moveTo(feature_map[i+j][0],feature_map[i+j][1]);
				ctx.lineTo(feature_map[i+N+j][0],feature_map[i+N+j][1]);
				ctx.closePath();
				ctx.stroke();
			}
			else{
				ctx.beginPath();
				ctx.moveTo(feature_map[i+j][0],feature_map[i+j][1]);
				ctx.lineTo(feature_map[i+j+N][0],feature_map[i+j+N][1]);
				ctx.closePath();
				ctx.stroke();
			}
		}
	}
	for(var j=0; j<N-1; j++){
		ctx.moveTo(feature_map[N*(N-1)+j][0],feature_map[N*(N-1)+j][1]);
		ctx.lineTo(feature_map[N*(N-1)+j+1][0],feature_map[N*(N-1)+j+1][1]);
		ctx.stroke();
	}
	
	for(var t in trained_points){
		ctx.fillStyle = "#2E64FE";
		ctx.beginPath();
		ctx.arc(trained_points[t][0], trained_points[t][1], 5, 0, Math.PI * 2, true);
		ctx.fill();
	}
}




