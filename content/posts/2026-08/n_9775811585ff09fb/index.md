---
id: n_9775811585ff09fb
title: 丐逻 · 丐版多功能逻辑探针
updated: "2026-08-07T03:19:07Z"
date: "2026-08-07"
public: true
draft: false
---

<div style="background:#161b22;color:#f0f0f0;padding:24px;border-radius:12px;font-family:system-ui">
<h2 style="color:#4ade80;margin-top:0">🛠️ 丐逻 · 丐版多功能逻辑探针</h2>
<p style="color:#a5b4fc">CH55X‑Probe Type‑C迷你测量探针 | 单片机硬件调试神器</p>
<hr style="border-color:#30363d" />

<h3>📖 项目简介</h3>
<p>一款体积小巧、性价比拉满的USB‑CDC迷你多功能调试探针，基于CH55系列USB单片机开发。Type‑C接口同时负责供电与数据通讯，整块迷你PCB高度集成，搭载9种工作测量模式，专为硬件发烧友、嵌入式开发者、电子爱好者用于电路板快速排查。
<br /><br />设备支持在线固件升级功能，后续新功能、BUG修复均可直接更新；<strong>固件源码现阶段暂不对外开放，待代码结构整理完毕、功能稳定之后正式放出</strong>。
</p>


<div style="margin:16px 0">
<img src="https://image.lceda.cn/oshwhub/pullImage/429767c890bd4e3f964cc47b040c5932.png" style="border-radius:8px;width:100%" />
<p style="font-size:13px;color:#9ca3af;margin-top:6px">图1：探针硬件实物，Type‑C接口 + 三路镀金探测触点</p>
</div>

<h3>✨ 全部工作模式</h3>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
<span style="background:#212836;padding:8px;border-radius:6px">🔹脉冲发生器</span>
<span style="background:#212836;padding:8px;border-radius:6px">🔹模拟电压采集</span>
<span style="background:#212836;padding:8px;border-radius:6px">🔹频率计数器</span>
<span style="background:#212836;padding:8px;border-radius:6px">🔹高低电平检测</span>
<span style="background:#212836;padding:8px;border-radius:6px">🔹电容测量</span>
<span style="background:#212836;padding:8px;border-radius:6px">🔹电阻测量</span>
<span style="background:#212836;padding:8px;border-radius:6px">🔹二极管通断测试</span>
<span style="background:#212836;padding:8px;border-radius:6px">🔹逻辑分析仪</span>
<span style="background:#212836;padding:8px;border-radius:6px">🔹IO程控输出</span>
</div>

<h3>🖥️ 上位机软件演示</h3>

<div style="margin:16px 0">
<img src="https://image.lceda.cn/oshwhub/pullImage/ff826dbfd34c454ea598d1df986a2fbb.png" style="border-radius:8px;width:100%" />
<p style="font-size:13px;color:#9ca3af;margin-top:6px">图2：PC上位机波形采集界面，脉冲模式可自定义分频、占空比，支持海量采样点波形回看</p>
</div>


<h3>📦 硬件参数</h3>
<ul style="padding-left:20px;line-height:1.7">
<li>通讯接口：USB‑Type‑C，USB‑CDC虚拟串口通信</li>
<li>测试触点：3路镀金探测焊盘</li>
<li>板载实体按键，实现设备快捷操控</li>
<li>超小型便携PCB，可适配定制硅胶保护外壳</li>
<li>特色功能：支持USB在线固件升级，迭代新增功能</li>
<li>配套上位机：CH55x‑Probe可视化波形客户端</li>
<li>上位机和设备端均支持无感升级，并持续迭代中</li>
<li>复刻首次只需要 按下按钮插入usb即可进入升级模式，在上位机端右上角点升级固件即可将固件更新到最新版本，后面可直接更新</li> 
</ul>

<h3>🖥️ 上位机软件功能</h3>
<p>专属Windows客户端，可以实时绘制采集波形；脉冲模式下自由调节分频参数、PWM占空比；支持波形历史回看、自定义采样速率，大容量采样缓存，直观观测IO引脚电平变化。</p>

<h3>🎯 适用使用场景</h3>
<ul style="padding-left:20px;line-height:1.7">
<li>单片机IO调试、PWM脉冲信号输出测试</li>
<li>快速检测电阻、电容、二极管元器件好坏</li>
<li>数字电路电平抓取，充当简易逻辑分析仪</li>
<li>学生电子制作、DIY硬件、日常电路板维修调试</li>
</ul>

<h3>📂 当前开源资源清单</h3>
<p>PCB工程文件｜原理图｜BOM物料清单｜Windows上位机程序</p>

<div style="margin-top:20px;background-color:#232c3b;padding:12px;border-radius:8px;color:#94a3b8">
💡 开源说明：设备固件现阶段暂未开源，待代码结构整理完毕、功能稳定之后将会开放全部固件源代码。探针主打超高性价比，九大调试模式齐全，是日常硬件调试的便携多功能工具。
</div>
</div>
