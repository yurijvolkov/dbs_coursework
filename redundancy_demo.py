import sys

from requests import get, post

def create_record_demo():
    return post('http://localhost:8045/paths',
                json='{"name": "ToUniversity", "nodes": [1,2,3]}')

def get_record_demo():
    return get('http://localhost:8045/paths?path_name=ToUniversity').text

def delete_record_demo():
    return delete('http://localhost:8045/paths?path_name=ToUniversity') 




if __name__ == '__main__':
    n = int(sys.argv[1])

    if n == 0:
        print(create_record_demo())
    elif n == 1:
        print(get_record_demo())
    elif n == 2:
        print(delete_record_demo())


