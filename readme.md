# Coooodeeeeee



---
HFO[代码](https://github.com/LARG/HFO)
## 基本介绍
一个足球的模拟平台，程序基本的逻辑结构是先运行一个后台的server，比如
```
./bin/HFO --offense-npcs=2 --defense-npcs=2 --no-sync &
```
后台运行一个server，这场足球对抗里有两个进攻者，两个防守者，都是npc（意思是他们的行为是程序中定义好了的）
比如
```
./bin/HFO --offense-agent=2 --defense-npcs=2 --no-sync &
```
就是有两个进攻者为agent，后面需要运行两个agent的程序，他们都会与后台的这个server交互。如果为agent就可以由设计者自己设计每个球员的行为规则，比如下面的例子

### Example Agents

#### C++ Agent
```c++
HFOEnvironment hfo;
hfo.connectToServer(...);
for (int episode=0; episode<5; episode++) {
  status_t status = IN_GAME;
  while (status == IN_GAME) {
    const std::vector<float>& feature_vec = hfo.getState();
    // act based on the perceived state feature
    hfo.act(DASH, 20.0, 0.0);
    status = hfo.step();
  }
  cout << "Episode " << episode << " ended";
}
```

#### Python Agent
```python
game = hfo.HFOEnvironment()
game.connectServer(...)
for episode in xrange(5):
    status = IN_GAME
    while status == IN_GAME:
        features = game.getState()
        game.act(DASH, 20.0, 0.0)
        status = game.step()
    print 'Episode', episode, 'ended'
```
## 我想要的变化
### 程序现状
如果我的游戏里有多个agent，现在每个agent参与游戏的方式都是，先hfo.connectToServer(...)，就是与后台这个统一的server先联系上。然后后台这个server会记录下每个跟他连接上的agent的有关信息（也就是每个agent或者球员的状态）然后每个agent做决策的时候都会跟server要关于他的当前状态，然后依据这个状态做决策。
假如我想要一个3v3对抗的足球游戏，先开一个server
```
./bin/HFO --offense-agent=3 --defense-npcs=3 --no-sync &
```
然后需要运行三个
```
./offense-agent
./offense-agent
./offense-agent
```
每个offense-agent获取自己的状态，做自己的决策，对整个球赛都有影响

### 我想改成
1. 我最想改成
    不需要后台运行的server，整个程序的逻辑结构如下
    ```
    game = HFOEnvironment(offend_agents, defend_agents, offend_npcs, defend_npcs, ...)
    status = IN_GAME
    while status == IN_GAME:
        features = game.get_features(playerid)
        actions = ChooseActionsBasedOnFeatures(features)
        game.act(playerid, actions)
        status = game.step()
    ```
    其中features为一个AgentNum x FeatureLength的矩阵
    actions为一个AgentNum x ActionParamLength的矩阵
    ChooseActionsBasedOnFeatures（）是我需要完成的函数，我就是想要一    个game.get_features这个接口，可以一次性拿到所有agent的feature vector

2. 退而求其次
    不修改server，但是还是要一个统一的get_features拿到所有场上的agent的状态。
    对于一个3v3对抗的足球游戏，先开一个server
    ```
    ./bin/HFO --offense-agent=3 --defense-npcs=3 --no-sync &
    ```
    然后需要运行一个统一的agent程序， 例如
    ```python
    game = hfo.HFOEnvironment()
    game.connectServer(...)
    for episode in xrange(5):
        status = IN_GAME
        while status == IN_GAME:
            features = game.get_featurese()
            actions = ChooseActionsBasedOnFeatures(features)
            game.act(actions)
            status = game.step()
        print 'Episode', episode, 'ended'
    ```
    这里的features仍然为一个AgentNum x FeatureLength的矩阵
    actions为一个AgentNum x ActionParamLength的矩阵
