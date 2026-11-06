import Foundation
import AppKit
import AVFoundation
import CoreVideo
let args = CommandLine.arguments
let source = args[1], target = args[2]
guard let image = NSImage(contentsOfFile: source), let cg = image.cgImage(forProposedRect: nil, context: nil, hints: nil) else { fatalError("Missing source screenshot") }
try? FileManager.default.removeItem(atPath: target)
let width = 1200, height = 783, fps: Int32 = 24
let writer = try AVAssetWriter(outputURL: URL(fileURLWithPath:target), fileType:.mp4)
let input = AVAssetWriterInput(mediaType:.video, outputSettings:[AVVideoCodecKey:AVVideoCodecType.h264,AVVideoWidthKey:width,AVVideoHeightKey:height,AVVideoCompressionPropertiesKey:[AVVideoAverageBitRateKey:1800000]])
let adaptor = AVAssetWriterInputPixelBufferAdaptor(assetWriterInput:input,sourcePixelBufferAttributes:[kCVPixelBufferPixelFormatTypeKey as String:kCVPixelFormatType_32ARGB,kCVPixelBufferWidthKey as String:width,kCVPixelBufferHeightKey as String:height])
writer.add(input);writer.startWriting();writer.startSession(atSourceTime:.zero)
for frame in 0..<192 {
 while !input.isReadyForMoreMediaData { Thread.sleep(forTimeInterval:0.005) }
 var pixel: CVPixelBuffer?
 CVPixelBufferPoolCreatePixelBuffer(nil,adaptor.pixelBufferPool!,&pixel)
 let buffer = pixel!
 CVPixelBufferLockBaseAddress(buffer,[])
 let context = CGContext(data:CVPixelBufferGetBaseAddress(buffer),width:width,height:height,bitsPerComponent:8,bytesPerRow:CVPixelBufferGetBytesPerRow(buffer),space:CGColorSpaceCreateDeviceRGB(),bitmapInfo:CGImageAlphaInfo.noneSkipFirst.rawValue)!
 // Hold at the top, scroll down, pause, and return for a seamless loop.
 let t = Double(frame)/24.0
 let raw = t < 1 ? 0 : t < 4 ? (t-1)/3 : t < 5 ? 1 : (8-t)/3
 let progress = max(0,min(1,raw));let eased = progress*progress*(3-2*progress)
 let scaledHeight = Double(cg.height)*Double(width)/Double(cg.width)
 let offset = eased * min(scaledHeight-Double(height),650)
 context.draw(cg,in:CGRect(x:0,y:Double(height)-scaledHeight+offset,width:Double(width),height:scaledHeight))
 adaptor.append(buffer,withPresentationTime:CMTime(value:Int64(frame),timescale:fps))
 CVPixelBufferUnlockBaseAddress(buffer,[])
}
input.markAsFinished()
let done=DispatchSemaphore(value:0)
writer.finishWriting{done.signal()};done.wait()
if writer.status != .completed { fatalError("Encoding failed: \(String(describing:writer.error))") }
print("Created \(target)")
