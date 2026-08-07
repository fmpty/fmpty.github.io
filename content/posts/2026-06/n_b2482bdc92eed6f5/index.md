---
id: n_b2482bdc92eed6f5
title: stt分析
updated: "2026-08-07T03:24:29Z"
date: "2026-08-07"
public: true
draft: false
---

这个项目里的语音识别在 [stt.c](E:/Prj/2026/other/ch/ch32fun/examples_x00x/ch32v003_stt/stt.c:1)，本质是一个“小词表模板匹配器”，不是 Whisper 那种大模型听写。它只识别 spoken digits，也就是 0 到 9。核心思路是：

声音 -> 音频采样 -> 频谱 -> Mel 特征 -> MFCC 压缩特征 -> 和训练样本比较 -> 输出最像的数字。

它的原理可以这样理解：

1. **麦克风把声音变成电压**

MAX4466 麦克风模块输出模拟电压，接到 CH32V003 的 `PC4` ADC 输入。声音越强、电压波动越大。

程序用定时器不断触发 ADC 采样，代码在 [stt.c](E:/Prj/2026/other/ch/ch32fun/examples_x00x/ch32v003_stt/stt.c:125)。它先高速采样，然后每 8 个样本平均一次，得到大约 **6400 Hz** 的音频流。

也就是说，它每秒拿到约 6400 个声音数字点。

2. **每 10ms 分析一次声音**

程序每收集 64 个采样点，也就是约 10ms，就做一次分析。但 FFT 用的是最近 128 个点，所以实际看的是约 20ms 的声音窗口。

这就像人不是一个点一个点听声音，而是一小片一小片地看声音形状。

相关参数在 [stt.c](E:/Prj/2026/other/ch/ch32fun/examples_x00x/ch32v003_stt/stt.c:9)：

```c
#define FFT 128
#define N 64
#define MEL 20
#define CEPS 8
```

含义是：

- `FFT 128`：每次用 128 点做频谱分析
- `N 64`：每 64 点推进一次，也就是 10ms 一帧
- `MEL 20`：压成 20 个 Mel 频带
- `CEPS 8`：最后再压成 8 个 MFCC 特征

3. **预加重：去掉直流和低频拖尾**

这段代码：

```c
re[i] = re[i] - re[n];
re[0] = 0;
```

在 [stt.c](E:/Prj/2026/other/ch/ch32fun/examples_x00x/ch32v003_stt/stt.c:246)。

它做的是“当前采样减去上一个采样”。效果是：

- 去掉麦克风偏置电压
- 强调声音变化
- 减少低频轰隆声
- 让后面的频谱更像语音特征

可以理解成：它不关心“电压本身多高”，更关心“声音波形怎么变化”。

4. **FFT：把声音从时间变成频率**

原始音频是这样的：

> 第 1 个采样多少，第 2 个采样多少，第 3 个采样多少……

但语音识别更关心：

> 低频有多少？中频有多少？高频有多少？

所以程序调用：

```c
simple_int_fft(FFT);
```

在 [stt.c](E:/Prj/2026/other/ch/ch32fun/examples_x00x/ch32v003_stt/stt.c:248)。

FFT 会把一段声音变成频谱。比如说“一”和“七”的波形肉眼看可能都乱，但它们的频率分布、共振峰、能量变化不一样。

5. **Mel 频带：模仿人耳听觉**

FFT 会得到很多频率点，但人耳不是线性听频率的。人对低频更敏感，对高频分辨率没那么细。

所以程序用 `mel_mx.h` 把 FFT 结果合并成 20 个 Mel 频带：

```c
mel[n] += re[mel_mx[i]] * mel_mx[i+1];
```

在 [stt.c](E:/Prj/2026/other/ch/ch32fun/examples_x00x/ch32v003_stt/stt.c:254)。

你可以把这一步想成：把复杂频谱整理成 20 根柱子，每根柱子表示某个“人耳感觉上的频段”有多强。

6. **log：把能量压缩**

声音能量变化范围很大。程序用：

```c
mel[i] = intlog2_8bit(mel[i]);
```

在 [stt.c](E:/Prj/2026/other/ch/ch32fun/examples_x00x/ch32v003_stt/stt.c:258)。

这一步相当于取对数。原因是：

- 人耳对响度的感知接近对数
- 大声音不会把特征撑爆
- 小声音也还能保留差异

7. **噪声地板：减掉环境底噪**

程序维护了一个 `nfloor` 噪声基线，在 [stt.c](E:/Prj/2026/other/ch/ch32fun/examples_x00x/ch32v003_stt/stt.c:234)。

当声音能量低于阈值时，它认为当前主要是环境噪声，就慢慢更新噪声水平。之后每帧都减掉这个噪声：

```c
mel[i] -= nfloor[i];
```

在 [stt.c](E:/Prj/2026/other/ch/ch32fun/examples_x00x/ch32fun/examples_x00x/ch32v003_stt/stt.c:262) 附近。

这一步很重要，因为麦克风、电源、环境都有底噪。减掉底噪后，留下来的更接近真正说话的部分。

8. **DCT：从 Mel 特征变成 MFCC**

然后程序做 DCT，把 20 个 Mel 特征压成 8 个 cepstrum 特征：

```c
cep[n] += mel[i] * dctm_8bit[n*MEL+i];
```

这就是简化版 **MFCC**。

MFCC 可以理解成“语音指纹”。它不是保存完整声音，而是保存声音频谱形状的摘要。每 10ms 得到 8 个数。

所以一段话会变成：

```text
第 1 帧: 8 个特征
第 2 帧: 8 个特征
第 3 帧: 8 个特征
...
```

9. **用能量阈值判断开始和结束**

程序用能量 `e` 判断这一帧是不是有人在说话：

```c
if (e > TOL_ON) {
    // capture audio frame
}
if (e < TOL_OFF) silcount++;
```

在 [stt.c](E:/Prj/2026/other/ch/ch32fun/examples_x00x/ch32v003_stt/stt.c:282)。

阈值在 [stt.c](E:/Prj/2026/other/ch/ch32fun/examples_x00x/ch32v003_stt/stt.c:20)：

```c
#define TOL_ON  200
#define TOL_OFF 150
```

也就是：

- 能量大于 200：认为开始说话/继续说话
- 能量小于 150：认为可能是静音
- 静音持续一段时间：认为这个词说完了

这里用了两个阈值，是为了避免在边界附近反复抖动。

10. **把不同长度的词统一成 16 帧**

不同人说 “one” 可能快，可能慢。程序为了方便比较，把捕获到的词统一变成 **16 帧**：

```c
wsize = 16;
```

在 [stt.c](E:/Prj/2026/other/ch/ch32fun/examples_x00x/ch32v003_stt/stt.c:304)。

如果原来短，就拉长；如果原来长，就压缩。最后每个词都是：

```text
16 帧 × 每帧 8 个 MFCC = 128 个数字
```

这 128 个数字就是这次说话的“特征向量”。

11. **和 codebook 模板比较**

训练好的数字样本放在 [codebook.h](E:/Prj/2026/other/ch/ch32fun/examples_x00x/ch32v003_stt/codebook.h:1)。

每个模板也是：

```text
数字标签 + 16 帧 × 8 个特征
```

识别时，程序把当前词和 codebook 里的每个样本逐个比较：

```c
d = word[i*CEPS+n] - cb[c];
dist += d*d;
```

在 [stt.c](E:/Prj/2026/other/ch/ch32fun/examples_x00x/ch32v003_stt/stt.c:311)。

这就是平方距离。距离越小，说明越像。

最后选距离最小的那个：

```c
printf("best match = %d, bestdist=%d\n", best, bestdist);
```

在 [stt.c](E:/Prj/2026/other/ch/ch32fun/examples_x00x/ch32v003_stt/stt.c:315)。

所以它的判断方式很朴素：

> 当前声音的 MFCC 特征，最接近哪个已保存样本，就认为说的是哪个数字。

一句话总结：  
这个语音识别不是“理解语义”，而是把声音压缩成 MFCC 特征，然后做模板匹配。它能在很小的 CH32V003 上运行，是因为它把问题限制得很小：只识别 0 到 9，用整数计算，用 6400Hz 低采样率，用 8 维特征和 16 帧模板来比较。
