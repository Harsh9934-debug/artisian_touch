import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useRef } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";
import API_URL from "@/config/api";

function MultiImageUpload({
    imageFiles,
    setImageFiles,
    uploadedImageUrls,
    setUploadedImageUrls,
    setImageLoadingState,
    imageLoadingState,
    isEditMode = false,
    isCustomStyling = false,
}) {
    const inputRef = useRef(null);

    function handleImageFileChange(event) {
        const selectedFiles = Array.from(event.target.files || []);
        if (selectedFiles.length > 0) {
            setImageFiles((prev) => [...prev, ...selectedFiles]);
        }
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDrop(event) {
        event.preventDefault();
        const droppedFiles = Array.from(event.dataTransfer.files || []);
        if (droppedFiles.length > 0) {
            setImageFiles((prev) => [...prev, ...droppedFiles]);
        }
    }

    function handleRemoveImage(indexToRemove) {
        // Remove from files array if it hasn't been uploaded yet (or matches index)
        // For simplicity, we manage UI state by combining both arrays if needed,
        // but here we assume uploadedImageUrls is the source of truth for display
        // if editing, and imageFiles are newly added ones.

        const updatedUrls = [...uploadedImageUrls];
        updatedUrls.splice(indexToRemove, 1);
        setUploadedImageUrls(updatedUrls);

        // Also remove from files if it correlates (simplified logic)
        const updatedFiles = [...imageFiles];
        if (indexToRemove < updatedFiles.length) {
            updatedFiles.splice(indexToRemove, 1);
            setImageFiles(updatedFiles);
        }

        if (inputRef.current) {
            inputRef.current.value = "";
        }
    }

    async function uploadImagesToCloudinary() {
        setImageLoadingState(true);

        const newUrls = [];

        // Only upload files that aren't already URLs (newly added files)
        // The imageFiles state should ideally only contain new files to upload
        for (const file of imageFiles) {
            // basic check if it's a File object (has a name/size)
            if (file instanceof File) {
                const data = new FormData();
                data.append("my_file", file);
                try {
                    const response = await axios.post(
                        `${API_URL}/api/admin/products/upload-image`,
                        data
                    );
                    if (response?.data?.success) {
                        newUrls.push(response.data.result.url);
                    }
                } catch (error) {
                    console.error("Error uploading image:", error);
                }
            }
        }

        if (newUrls.length > 0) {
            setUploadedImageUrls((prev) => {
                // Avoid duplicates if re-rendering triggers upload again
                const combined = [...prev, ...newUrls];
                return [...new Set(combined)];
            });
        }

        setImageLoadingState(false);
        // Clear files after successful upload to prevent re-uploading
        setImageFiles([]);
    }

    useEffect(() => {
        if (imageFiles && imageFiles.length > 0) {
            uploadImagesToCloudinary();
        }
    }, [imageFiles]);

    return (
        <div
            className={`w-full mt-4 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}
        >
            <Label className="text-lg font-semibold mb-2 block">Upload Images</Label>
            <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-[1rem] p-6 bg-slate-50 transition-colors hover:bg-slate-100 flex flex-col items-center justify-center`}
            >
                <Input
                    id="multi-image-upload"
                    type="file"
                    className="hidden"
                    ref={inputRef}
                    onChange={handleImageFileChange}
                    multiple
                    accept="image/*"
                />
                <Label
                    htmlFor="multi-image-upload"
                    className={`flex flex-col items-center justify-center cursor-pointer w-full h-24`}
                >
                    <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
                    <span className="text-sm font-medium text-slate-600">Drag & drop or click to upload multiple images</span>
                </Label>
            </div>

            {imageLoadingState && (
                <div className="mt-4 flex flex-col gap-2">
                    <Skeleton className="h-10 w-full bg-slate-200 rounded-md" />
                    <Skeleton className="h-10 w-full bg-slate-200 rounded-md" />
                </div>
            )}

            {uploadedImageUrls && uploadedImageUrls.length > 0 && !imageLoadingState && (
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {uploadedImageUrls.map((url, index) => (
                        <div key={index} className="relative group rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                            <img src={url} alt={`Uploaded ${index + 1}`} className="w-full h-32 object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="rounded-full h-8 w-8 shadow-md"
                                    onClick={() => handleRemoveImage(index)}
                                >
                                    <XIcon className="w-4 h-4" />
                                    <span className="sr-only">Remove File</span>
                                </Button>
                            </div>
                            {index === 0 && (
                                <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                                    Primary
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MultiImageUpload;
