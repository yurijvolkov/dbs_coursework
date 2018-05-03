import sys

from requests import get, post

def create_record_demo(s):
    return post('http://localhost:8045/paths',
                json='{"name": "%s", "nodes": [1,2,3]}' % s)

def get_record_demo(s):
    return get(f'http://localhost:8045/paths?path_name=%s' % s).text

def delete_record_demo(s):
    return delete('http://localhost:8045/paths?path_name=%s' % s) 




if __name__ == '__main__':
    n = int(sys.argv[1])

    if n == 0:
        print(create_record_demo(sys.argv[2]))
    elif n == 1:
        print(get_record_demo(sys.argv[2]))
    elif n == 2:
        print(delete_record_demo(sys.argv[2]))


