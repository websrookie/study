import React from 'react'; // 老版本必须引入
let h1 = <h1> hello </h1>

// 老的转换
React.createElement('h1', null, 'hello');

// 新版本
import jsx from 'jsx';
jsx('h1', null, 'hello');
React17 新加的功能1
