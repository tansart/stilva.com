import React, {memo} from 'react';

export default memo(function () {
  return <>
    <h1>MediaPipe</h1>
    <p>
      This lab note is meant to be a brief documentation on my experiments with TFLite and MediaPipe. I'll go over the
      following:
    </p>
    <ul>
      <li>Overview of my ML training set-up</li>
      <li>MediaPipe overview</li>
      <li>Custom MediaPipe calculator</li>
    </ul>
    <h2>ML training set-ups:</h2>
    <p>
      A couple of years ago, I heavily relied on AWS EC2 Spot instances (<code>g2.2xlarge</code>) with EBS storage for
      the training assets, and the model weights. Unfortunately the cost of training was quickly going up, and back then
      Google Colab wasn't quite a thing (nor any of Google's TPU offerings).
    </p>
    <p>
      After running some continuous experiments on the cloud, I reached the point where building my own machine would be
      more cost effective – so I got myself a GTX 1080 Ti, and built my own ML rig.
    </p>
    <p>
      I <code>ssh</code> into my machine, then use <code>tmux</code> to set-up some persistent sessions. Within
      a <code>tmux</code> session, I launch my jupyter server with <code>jupyter notebook --no-browser --port=8888
      --ip=0.0.0.0</code>. The <code>--ip</code> is set to <code>0.0.0.0</code> so I can check on my notebooks while on
      the go.
    </p>
    <p>
      An alternative to using the <code>--ip</code> option stated above, is to use ssh port forwarding: <code>ssh -NL
      8888:localhost:8888 username@64.233.160.0</code>, which will map your local <code>8888</code> port to the
      server's <code>8888</code> port. You can then access <code>https://localhost:8888</code> on from your host.
    </p>
    <h2>MediaPipe overview:</h2>
    <p>
      <a href="https://google.github.io/mediapipe/" target="_blank">MediaPipe</a> is a graph based cross platform
      framework, that facilitates building a pipeline for your ML apps. I was sold on the graph based concept, and
      overall seemed like an interesting tool to experiment with.
    </p>
    <p>
      <i>Note:</i> There are a few TFLite examples out there, showing ways of running a <code>.tflite</code> model on a
      mobile. I just wanted to experiment with MediaPipe.
    </p>
    <p>
      While the concept is great, MediaPipe has quite the steep learning curve. Bazel, C++, TFLite's C++ API, MediaPipe
      Calculators. I've spent quite some time just trying to set-up a project. Turns out, when you want to create your
      own calculators, tweak some components that are given to you, you need to just fork the project. My workflow
      current workflow is to point <code>origin</code> to my github,
      and <code>upstream</code> to <code>google/mediapipe</code>, and <code>git rebase
      upstream/master</code>.
    </p>
    <p>
      <i>Note:</i> it is possible to reference mediapipe from within your bazel build files (<a
      href="https://github.com/mgyong/mediapipe_addons/blob/master/helloworld/BUILD">here</a>'s an example), there are a
      lot of restrictions when it comes to package visibility. After couple of hours hacking away and going through
      bazel documentation, I gave up and opted for my current workflow.
    </p>
    <p>
      On top of the steep learning curve, it's still in alpha so there's no guarantees the current API will stand.
      Moreover, the documentation is still lacking.
    </p>
    {/*<p>
      export ANDROID_NDK_HOME=/Users/thomas/Library/Android/sdk/ndk/21.2.6472646/
      open -a "Android Studio"
    </p>*/}
    <p>
      <code>
        bazel build -c opt --config=android_arm64
        //mediapipe/examples/android/src/java/com/google/mediapipe/apps/basic:helloworld --sandbox_debug && adb install
        bazel-bin/mediapipe/examples/android/src/java/com/google/mediapipe/apps/basic/helloworld.apk && adb shell am
        start
        -n com.google.mediapipe.apps.basic/com.google.mediapipe.apps.basic.MainActivity && sleep 2 && adb logcat
        --pid=`adb shell pidof -s com.google.mediapipe.apps.basic`
      </code>
    </p>
    <p>
      This one-liner compiles all your calculator, bundles your <code>.tflite</code> model, streams the
      final <code>.apk</code> onto your phone, and launches the <code>MainActivity</code>.
    </p>
    <h2>Custom MediaPipe calculator</h2>
    <p>
      I've also gone ahead and created a new calculator that
      converts <code>std::vector &lt;GlBuffer&gt;</code> into <code>mediapipe::GpuBuffer</code>. This is great for
      models that spit out an image.
    </p>
    {/*<p>
      In the future, I'd like to import https://bkaradzic.github.io/bgfx/ assuming it works on iOS.
    </p>*/}
  </>
});
