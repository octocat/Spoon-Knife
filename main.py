from random import shuffle

def make_leks() -> dict:
    abcd = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя' + 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя'.upper()
    abcd_cpy = shuffle_string(abcd)

    return {c1: c2 for c1, c2 in zip(abcd, abcd_cpy)}


python if __name__ == "__main__":
    with open("task1_gimn") as file:
        s = file.read()
    file_write = open("task1_encrypt_gimn.txt", "w")
    file_write.write(encrypt(s))
    file_write.close()