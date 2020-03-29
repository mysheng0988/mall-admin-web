# -*- coding: utf-8 -*-
# author: lituoheng


# 环境要求python3以上
# 在命令行cmd用管理员模式使用"pip install gevent grequests"即可安装需要的第三方模块

import grequests
import time
from collections import Counter

# 重写了模块内的方法，增加请求成功时的回调
def map(requests, stream=False, size=None, exception_handler=None, gtimeout=None, success_handler=None):
    """Concurrently converts a list of Requests to Responses.

    :param requests: a collection of Request objects.
    :param stream: If True, the content will not be downloaded immediately.
    :param size: Specifies the number of requests to make at a time. If None, no throttling occurs.
    :param exception_handler: Callback function, called when exception occured. Params: Request, Exception
    :param gtimeout: Gevent joinall timeout in seconds. (Note: unrelated to requests timeout)
    :param success_handler: Callback function, called when secceed. Params: Request
    """

    requests = list(requests)

    pool = grequests.Pool(size) if size else None
    jobs = [grequests.send(r, pool, stream=stream) for r in requests]
    grequests.gevent.joinall(jobs, timeout=gtimeout)

    ret = []

    for request in requests:
        if request.response is not None:
            ret.append(request.response)
            success_handler and success_handler(request)
        elif exception_handler and hasattr(request, 'exception'):
            ret.append(exception_handler(request, request.exception))
        else:
            ret.append(None)

    return ret

grequests.map = map

def main():

    #成功失败计数器
    success = 0
    fail = 0

    # 请求成功时传入的函数
    def suc_handler(request):
        nonlocal success
        success += 1
        # 转码解析
        # request.response.encoding = request.response.apparent_encoding
        # print(request.response.text)
        pass

    # 请求丢失时传入的函数
    def err_handler(request, exception):
        nonlocal fail
        fail += 1
        pass

    N = input('====================\n输入请求数量：')
    if not N.isdigit() or int(N) < 0:
        print('====================\n\n请输入正整数！\n\n====================')
        raise TypeError
    N = int(N)
    
    #请求头
    header = {"Content-type": "appliaction/json", "Accept":"application/json"} 
    
    # 请求初始化，具体参数可参考requests模块，可以初始化提交类型、请求头、代理、超时等
    reqs = [
        # grequests.get('http://appmid:8080/testDict/emr/WorkDesktop.jsp', timeout=10) for _ in range(N)
        # grequests.post('http://192.168.1.111:9090/office/home/index', timeout=10) for _ in range(N)
        # grequests.post('https://www.chudshop.com/office/home/index', timeout=10) for _ in range(N)
        # grequests.post('http://www.imooc.com/search/hotwords', timeout=10) for _ in range(N)
        grequests.get('http://www.baidu.com', headers=header) for _ in range(N)
    ]

    print(f'====================')
    print(f'请求地址：{reqs[0].url}')
    print(f'请求数量：{N}')

    # 连续并发请求M轮
    M = 1
    for i in range(M):

        start = time.time()
        #并发发送请求，gtimeout为总体请求限定时间，单位秒
        res_list = grequests.map(
            reqs, 
            exception_handler=err_handler, 
            success_handler=suc_handler, 
            # gtimeout=100
        )

        if M > 1:
            print(f'--------------------')
            print(f'第{i + 1}轮结果')
        print(f'====================')
        print(f'请求时间：{round(time.time() - start, 4)}秒')
        print(f'链接成功：{success}')
        print(f'链接失败：{fail}')
        print(f'成功率：  {round(100 * success / N, 2)}%')
        print(f'====================')
        print(f'状态码统计:')
        
        statusCounters = Counter(res.status_code if str(type(res)) == "<class 'requests.models.Response'>" else 'lost' for res in res_list)
        for k, v in statusCounters.items():
            print(f'{k}: {v}')

        print(f'====================')

        out = ''
        # 取消下一行注释即可获得输出
        # out = input('是否输出返回结果[Y/-]：')
        if out in {'y', 'Y', '1', ' ', '是', '输出'}:
            for res in res_list:
                # 转码解析
                res.encoding = res.apparent_encoding
            print(f'====================')
            # 返回结果可以通过内置json模块解析数据json数据，或者通过第三方模块beautifulsoup、pyquery（jQuery的Python版）进行页面解析
            print([item.text for item in res_list])
            print(f'====================')
        
        # 休眠时间，单位秒
        # time.sleep(1)
    

if __name__ == "__main__":
    main()