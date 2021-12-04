'use strict'

const { performance } = require('perf_hooks')
const { getHeapStatistics } = require('v8')

const BYTE = 8
const BYTE_2 = 16
const BYTE_4 = 32

const compareArrayPerf = function(N_arr, N_trial,  eltSize) {
	let arrConstructor
	
	switch(eltSize) {
		case BYTE: arrConstructor = Uint8Array; break;
		case BYTE_2: arrConstructor = Uint16Array; break;
		case BYTE_4: arrConstructor = Uint32Array; break;
		default: arrConstructor = Array; break;
	}
	
	const N_total = N_arr * N_arr	
	let perf_matrix = 0.0, perf_vector = 0.0;
	
	(function() {
		perf_vector = performance.now()
		const vector = new arrConstructor(N_total)
		
		for(let k = 0; k < N_trial; k++) {
			for(let i = 0; i < N_total; i++) {
				vector[i] = 255
				vector[i] = 0
				vector[i] = 255
				vector[i] = 0
				vector[i] = 255
				vector[i] = 0
				vector[i] = 255
				vector[i] = 0
				vector[i] = 1
			}
		}
		
		perf_vector = performance.now() - perf_vector
	})();
	
	(function() {		
		const matrix = new Array(N_arr)
		for(let i = 0; i < N_arr; i++) {
			matrix[i] = new arrConstructor(N_arr)
		}
		perf_matrix = performance.now();
		for(let k = 0; k < N_trial; k++) {
			for(let i = 0; i < N_arr; i++) {
				for(let j = 0; j < N_arr; j++) {
					matrix[i][j] = 255
					matrix[i][j] = 0
					matrix[i][j] = 255
					matrix[i][j] = 0
					matrix[i][j] = 255
					matrix[i][j] = 0
					matrix[i][j] = 255
					matrix[i][j] = 0
					matrix[i][j] = 1
				}
			}
		}
			
		perf_matrix = performance.now() - perf_matrix
	})();
	//const memUsed = process.memoryUsage()
	//console.log('memory used')
	//console.log(memUsed)
	console.log(`vector: ${perf_vector.toFixed(3)}; matrix: ${perf_matrix.toFixed(3)} `)	
}

const compareBit2Obj = function(N_arr, N_trial) {
	let perf_bin, perf_obj;
	
	(function() {
		const testArr = new Array(N_arr)
		for(let i = 0; i < N_arr; i++) {
			testArr[i] = { now: 0xff, next: 0xff }
		}
		perf_obj = performance.now()
		
		for(let k = 0; k < N_trial; k++) {
			for(let i = 0; i < N_arr; i++) {
				testArr[i].now = testArr[i].next
				testArr[i].next = 0xdd
			}
		}
		
		perf_obj = performance.now() - perf_obj
	})();
	
	(function() {
		const testArr = new Uint16Array(N_arr)
		for(let i = 0; i < N_arr; i++) {
			testArr[i] = 0x0000
		}
		perf_bin = performance.now()
		
		for(let k = 0; k < N_trial; k++) {
			for(let i = 0; i < N_arr; i++) {
				testArr[i] >>= 2
				testArr[i] |= 0xdd00
			}
		}
		
		perf_bin = performance.now() - perf_bin
	})();

	console.log(`binary record perf: ${perf_bin.toFixed(2)}; object perf: ${perf_obj.toFixed(2)}`)
}

compareArrayPerf(1000, 100, 8)
compareArrayPerf(1000, 100, 8)
compareArrayPerf(1000, 100, 8)
compareArrayPerf(1000, 100, 8)
compareArrayPerf(1000, 100, 8)


/*compareBit2Obj(100000, 250)
compareBit2Obj(100000, 250)
compareBit2Obj(100000, 250)
compareBit2Obj(100000, 250)
compareBit2Obj(100000, 250)*/

/*compareArrayPerf(1000, 50)
console.log(getHeapStatistics().used_heap_size)
compareArrayPerf(1000, 50)
console.log(getHeapStatistics().used_heap_size)
compareArrayPerf(1000, 50)
console.log(getHeapStatistics().used_heap_size)
compareArrayPerf(1000, 50)
console.log(getHeapStatistics().used_heap_size)

const finalMemShot = setTimeout(() => {
	clearTimeout(finalMemShot)
	console.log(getHeapStatistics().used_heap_size)
},5000)*/