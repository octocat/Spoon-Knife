

python if __name__ == "__main__":
    with open("task1_gimn") as file:
        s = file.read()
    #print(encrypt(s))
    #print(s)
    file_write = open("task1_encrypt_gimn.txt", "w")
    file_write.write(encrypt(s))
    file_write.close()