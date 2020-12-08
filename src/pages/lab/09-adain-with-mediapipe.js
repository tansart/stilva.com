import React, {memo} from 'react';
import Code from '../../components/Code'

export default memo(function () {
  return <>
    <h1>AdaIN with MediaPipe</h1>
    <p>This is a work in progress – the Android app needs some UI work, and I'm still training the model.</p>
    <h2>Tensorflow implementation</h2>
    <p>
      I've been experimenting with MediaPipe for the last few months and my latest project has been an Android MediaPipe
      app<sup><b>[1]</b></sup> with a custom implementation of <a
      href="https://arxiv.org/pdf/1703.06868.pdf" target="_blank">Arbitrary Style Transfer in Real-time with Adaptive
      Instance Normalization</a>.
    </p>
    <p>
      Among other things, I've optimised both the encoder and the decoder that were used in the paper, I have used some
      additional loss function described in other papers to hopefully increase the output quality (although I haven't
      had the chance to test it with/without and test the output quality).
    </p>
    <h2>Android</h2>
    <p>
      While the video is a standard stream, the image with which to stylise the video had to be a lower rate stream.
      My initial idea was to use a side-packet, but it unfortunately did not work as I wasn't able to asynchronously
      initiate a side packet.
      Instead, any input value that changes over time needs to be a stream. Below is the code to take an image and
      asynchronously inject it into the mediapipe graph.
    </p>
    <Code lan="java">
      {`
@Override
public void onCaptureSuccess(ImageProxy image, int rotationDegrees) {
  AndroidPacketCreator packetCreator = processor.getPacketCreator();
  Map<String, Packet> inputSidePackets = new HashMap<>();
  ByteBuffer buffer = image.getPlanes()[0].getBuffer();
  byte[] bytes = new byte[buffer.remaining()];
  buffer.get(bytes);
  Bitmap bmp = BitmapFactory.decodeByteArray(bytes, 0, bytes.length, null);
  long timestamp = image.getTimestamp();

  image.close();

  try {
    Packet packet = packetCreator.createRgbImageFrame(bmp);
    processor.getGraph().addConsumablePacketToInputStream("input_image", packet, timestamp);
    packet = null;
  } catch (MediaPipeException e) {
    // TODO: do not suppress exceptions here!
    throw e;
  }
}
      `}
    </Code>
    <h2>MediaPipe</h2>
    <p>
      For a faster inference, I've split the model into two sub-models: an encoder model and a decoder model.
      The decoder model expects a vector of tensors at the same time. But as I mentioned above, the video stream
      operates at a higher clock-rate than the style image.
    </p>
    {/*<p>
      My first challenge was to synchronise the video stream to the style stream. I first reached out to
      the <code>PacketClonerCalculator</code>. The idea was to force the style packets to be cloned so we had as many
      style packets as video packets. Unfortunately there were "packet ownership issues".
    </p>
    <p>
      I then
    </p>*/}
    <p>
      By using the <code>ImmediateInputStreamHandler</code>, the calculator is able to run as soon as either stream was ready.
    </p>
    <Code lan="javascript">
      {`
input_stream_handler {
  input_stream_handler: "ImmediateInputStreamHandler"
}
      `}
    </Code>
    <p>
      As to keep as much on the GPU and avoid the CPU, I created another calculator that accepts
      a <code>std::vector &lt;GlBuffer&gt;</code> and outputs straight to a <code>GpuBuffer</code>
    </p>
    <p><b>[1]</b>: One of the MediaPipe calculator that I've built is missing its Metal implementation for iOS. I'll
      look into this next.</p>
  </>
});
