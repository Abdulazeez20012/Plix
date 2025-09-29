const {
  setCache,
  getCache,
  removeCache,
  clearExpiredCache,
  paginate,
  batchProcess,
  debounce,
  throttle,
  logPerformanceMetric,
  selectServer,
  compressData,
  decompressData
} = require('./scalabilityService');

async function testScalabilityService() {
  console.log('Testing Scalability Service');
  
  try {
    console.log('\n1. Testing caching...');
    setCache('testKey', 'testValue', 1000); // 1 second TTL
    console.log('Cached value:', getCache('testKey'));
    
    // Wait for cache to expire
    setTimeout(() => {
      console.log('Expired cache value:', getCache('testKey'));
    }, 1100);
    
    console.log('\n2. Testing pagination...');
    const testData = Array.from({ length: 50 }, (_, i) => `Item ${i + 1}`);
    const paginated = paginate(testData, 2, 10);
    console.log('Paginated data:', paginated);
    
    console.log('\n3. Testing batch processing...');
    const operations = [1, 2, 3, 4, 5];
    const processor = async (num) => {
      // Simulate async operation
      return new Promise(resolve => setTimeout(() => resolve(num * 2), 100));
    };
    
    const batchResults = await batchProcess(operations, processor, 2);
    console.log('Batch processing results:', batchResults);
    
    console.log('\n4. Testing debounce...');
    const debouncedFunc = debounce((msg) => {
      console.log('Debounced function called with:', msg);
    }, 500);
    
    debouncedFunc('First call');
    debouncedFunc('Second call');
    debouncedFunc('Third call');
    
    setTimeout(() => {
      console.log('Debounce test completed');
    }, 1000);
    
    console.log('\n5. Testing throttle...');
    const throttledFunc = throttle((msg) => {
      console.log('Throttled function called with:', msg);
    }, 500);
    
    throttledFunc('First call');
    throttledFunc('Second call');
    throttledFunc('Third call');
    
    console.log('\n6. Testing performance logging...');
    logPerformanceMetric('testOperation', 150);
    
    console.log('\n7. Testing server selection...');
    const servers = ['server1', 'server2', 'server3'];
    const selected = selectServer(servers, 'request123');
    console.log('Selected server:', selected);
    
    console.log('\n8. Testing data compression...');
    const originalData = 'This is some data that should be compressed';
    const compressed = compressData(originalData);
    console.log('Compressed data:', compressed);
    
    const decompressed = decompressData(compressed);
    console.log('Decompressed data:', decompressed);
    console.log('Data integrity:', originalData === decompressed);
    
    console.log('\nAll scalability tests completed successfully!');
  } catch (error) {
    console.error('Scalability test failed:', error);
  }
}

testScalabilityService();