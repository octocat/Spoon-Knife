from random import shuffle

def make_leks() -> dict:
    abcd = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя' + 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя'.upper()
    abcd_cpy = shuffle_leks(abcd)

    return {c1: c2 for c1, c2 in zip(abcd, abcd_cpy)}

def shuffle_leks (txt: str) -> str:
    txt_arr = list(txt)
    shuffle (txt_arr)
    return ''.join(txt_arr)

def encrypt_tekst(text: str, notepad: dict = None) -> str:
    if notepad is None:
        notepad = make_leks()
        print("Leks:", notepad, sep='\n')

    return ''.join([notepad.get(c, c) for c in text])

if __name__ == "__main__":
    with open("task1_gimn") as file:
        s = file.read()
    file_write = open("task1_encrypt_gimn.txt", "w")
    file_write.write(encrypt_tekst(s))
    file_write.close()
    