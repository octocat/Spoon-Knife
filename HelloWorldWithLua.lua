function SayThat(a, b)
    sayNow = {}
    isItGoodTime = true

    if isItGoodTime then
        if a == "Hello" and b == "World" then
            sayNow = (a..b)
        else
            print("Sorry not now")
        end

        print(sayNow)
    end
end

SayThat("Hello", "World")