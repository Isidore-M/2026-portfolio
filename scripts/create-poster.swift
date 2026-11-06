import Foundation
import AppKit
let source=CommandLine.arguments[1],target=CommandLine.arguments[2]
let image=NSImage(contentsOfFile:source)!.cgImage(forProposedRect:nil,context:nil,hints:nil)!
let crop=image.cropping(to:CGRect(x:0,y:0,width:image.width,height:940))!
let representation=NSBitmapImageRep(cgImage:crop)
try representation.representation(using:.png,properties:[:])!.write(to:URL(fileURLWithPath:target))
