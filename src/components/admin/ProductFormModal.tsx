import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  Film,
  Trash2,
  RefreshCw,
  ArrowLeft,
  ArrowRight,
  DollarSign,
  Scale,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Gemstone, WeightUnit, PriceDisplayType, ProductStatus, GemstoneType } from '../../types';
import { useEcommerce, inferStoneCategory } from '../../context/EcommerceContext';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Gemstone | null;
}

const COMMON_TYPES: (GemstoneType | string)[] = [
  'Emerald',
  'Ruby',
  'Sapphire',
  'Tourmaline',
  'Peridot',
  'Opal',
  'Amethyst',
  'Aquamarine',
  'Topaz',
  'Citrine',
  'Quartz',
  'Garnet',
  'Agate',
  'Natural Crystal',
];

const CURRENCY_OPTIONS = [
  { code: 'USD', label: 'USD ($)' },
  { code: 'PKR', label: 'PKR (Rs.)' },
  { code: 'AED', label: 'AED (Dirhams)' },
  { code: 'EUR', label: 'EUR (€)' },
  { code: 'GBP', label: 'GBP (£)' },
  { code: 'CAD', label: 'CAD ($)' },
  { code: 'AUD', label: 'AUD ($)' },
];

const ALLOWED_IMAGE_MIME_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp']);
const ALLOWED_IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const MAX_IMAGE_SIZE_BYTES = 15 * 1024 * 1024; // 15MB

const ALLOWED_VIDEO_MIME_TYPES = new Set(['video/mp4', 'video/webm', 'video/quicktime']);
const ALLOWED_VIDEO_EXTS = new Set(['.mp4', '.webm', '.mov']);
const MAX_VIDEO_SIZE_BYTES = 50 * 1024 * 1024; // 50MB

function getFileExtension(filename: string): string {
  const idx = filename.lastIndexOf('.');
  return idx >= 0 ? filename.slice(idx).toLowerCase() : '';
}

function extractFilenameFromUrl(url: string | null | undefined): string {
  if (!url) return '';
  const parts = url.split('/');
  return parts[parts.length - 1] || 'product-video.mp4';
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  productToEdit,
}) => {
  const { createProduct, updateProduct, uploadProductImage, uploadProductVideo } = useEcommerce();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const replaceImageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Form Fields
  const [name, setName] = useState(productToEdit?.name || '');
  const [category, setCategory] = useState<'Gemstone' | 'Crystal'>(
    productToEdit ? inferStoneCategory(productToEdit) : 'Gemstone'
  );
  const [weight, setWeight] = useState<string>(
    productToEdit?.weight !== undefined
      ? String(productToEdit.weight)
      : productToEdit?.carat !== undefined
      ? String(productToEdit.carat)
      : ''
  );
  const [weightUnit, setWeightUnit] = useState<WeightUnit>(productToEdit?.weightUnit || 'ct');

  // Price Display Type
  const [priceDisplayType, setPriceDisplayType] = useState<PriceDisplayType>(
    productToEdit?.priceDisplayType || 'fixed'
  );
  const [priceAmount, setPriceAmount] = useState<string>(
    productToEdit?.priceAmount !== undefined && productToEdit.priceAmount !== null
      ? String(productToEdit.priceAmount)
      : productToEdit?.priceUSD
      ? String(productToEdit.priceUSD)
      : ''
  );
  const [currency, setCurrency] = useState<string>(productToEdit?.currency || 'USD');

  // Description & Status
  const [description, setDescription] = useState(productToEdit?.description || '');
  const [status, setStatus] = useState<ProductStatus>(productToEdit?.status || 'published');

  // Product Images State
  const [images, setImages] = useState<string[]>(productToEdit?.images || []);
  const [replaceImageIndex, setReplaceImageIndex] = useState<number | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageErrorMessage, setImageErrorMessage] = useState<string | null>(null);

  // Product Video State
  const [videoUrl, setVideoUrl] = useState<string | null>(productToEdit?.videoUrl || null);
  const [videoFilename, setVideoFilename] = useState<string>(
    extractFilenameFromUrl(productToEdit?.videoUrl)
  );
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [videoUploadProgress, setVideoUploadProgress] = useState<number>(0);
  const [videoErrorMessage, setVideoErrorMessage] = useState<string | null>(null);

  // Optional Specifications (collapsible for clean mobile experience)
  const [showAdvancedSpecs, setShowAdvancedSpecs] = useState(false);
  const [type, setType] = useState(productToEdit?.type || 'Emerald');
  const [dimensions, setDimensions] = useState(productToEdit?.dimensions || '');
  const [origin, setOrigin] = useState(productToEdit?.origin || '');
  const [cut, setCut] = useState(productToEdit?.cut || '');
  const [color, setColor] = useState(productToEdit?.color || '');
  const [clarity, setClarity] = useState(productToEdit?.clarity || '');
  const [treatment, setTreatment] = useState(
    productToEdit?.treatment || 'Completely Untreated / Natural Earth-Mined'
  );
  const [certificateIssuer, setCertificateIssuer] = useState(
    productToEdit?.certificate?.issuer || 'Self-Inspected & Certified'
  );
  const [certificateNumber, setCertificateNumber] = useState(
    productToEdit?.certificate?.reportNumber || ''
  );
  const [isFeatured, setIsFeatured] = useState<boolean>(Boolean(productToEdit?.isFeatured));
  const [isBestseller, setIsBestseller] = useState<boolean>(Boolean(productToEdit?.isBestseller));

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync form state whenever modal opens or productToEdit changes
  useEffect(() => {
    if (!isOpen) return;
    setName(productToEdit?.name || '');
    setCategory(productToEdit ? inferStoneCategory(productToEdit) : 'Gemstone');
    setWeight(
      productToEdit?.weight !== undefined
        ? String(productToEdit.weight)
        : productToEdit?.carat !== undefined
        ? String(productToEdit.carat)
        : ''
    );
    setWeightUnit(productToEdit?.weightUnit || 'ct');
    setPriceDisplayType(productToEdit?.priceDisplayType || 'fixed');
    setPriceAmount(
      productToEdit?.priceAmount !== undefined && productToEdit.priceAmount !== null
        ? String(productToEdit.priceAmount)
        : productToEdit?.priceUSD
        ? String(productToEdit.priceUSD)
        : ''
    );
    setCurrency(productToEdit?.currency || 'USD');
    setDescription(productToEdit?.description || '');
    setStatus(productToEdit?.status || 'published');
    setImages(productToEdit?.images ? [...productToEdit.images] : []);
    setVideoUrl(productToEdit?.videoUrl || null);
    setVideoFilename(extractFilenameFromUrl(productToEdit?.videoUrl));
    setType(productToEdit?.type || 'Emerald');
    setDimensions(productToEdit?.dimensions || '');
    setOrigin(productToEdit?.origin || '');
    setCut(productToEdit?.cut || '');
    setColor(productToEdit?.color || '');
    setClarity(productToEdit?.clarity || '');
    setTreatment(productToEdit?.treatment || 'Completely Untreated / Natural Earth-Mined');
    setCertificateIssuer(productToEdit?.certificate?.issuer || 'Self-Inspected & Certified');
    setCertificateNumber(productToEdit?.certificate?.reportNumber || '');
    setIsFeatured(Boolean(productToEdit?.isFeatured));
    setIsBestseller(Boolean(productToEdit?.isBestseller));
    setErrorMessage(null);
    setImageErrorMessage(null);
    setVideoErrorMessage(null);
    setIsUploadingImage(false);
    setIsUploadingVideo(false);
    setVideoUploadProgress(0);
    setReplaceImageIndex(null);
  }, [isOpen, productToEdit]);

  if (!isOpen) return null;

  const validateImageFile = (file: File): string | null => {
    const ext = getFileExtension(file.name);
    const mime = (file.type || '').toLowerCase().trim();
    if (!ALLOWED_IMAGE_MIME_TYPES.has(mime) || !ALLOWED_IMAGE_EXTS.has(ext)) {
      return `Invalid image "${file.name}". Image must be JPG, JPEG, PNG, or WEBP format.`;
    }
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      return `Image "${file.name}" exceeds the 15MB maximum file size limit.`;
    }
    return null;
  };

  const validateVideoFile = (file: File): string | null => {
    const ext = getFileExtension(file.name);
    const mime = (file.type || '').toLowerCase().trim();
    if (!ALLOWED_VIDEO_MIME_TYPES.has(mime) || !ALLOWED_VIDEO_EXTS.has(ext)) {
      return 'Video must be MP4, WEBM, or MOV and must be within the allowed file size (50MB).';
    }
    if (file.size > MAX_VIDEO_SIZE_BYTES) {
      return 'Video must be MP4, WEBM, or MOV and must be within the allowed file size (50MB).';
    }
    return null;
  };

  // Handle adding one or multiple product images
  const handleImageFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const selectedFiles: File[] = Array.from(fileList);
    e.target.value = '';

    setImageErrorMessage(null);
    setErrorMessage(null);

    if (images.length + selectedFiles.length > 10) {
      setImageErrorMessage('A maximum of 10 product images can be uploaded per stone.');
      return;
    }

    for (const file of selectedFiles) {
      const validationError = validateImageFile(file);
      if (validationError) {
        setImageErrorMessage(validationError);
        return;
      }
    }

    setIsUploadingImage(true);
    const uploadedUrls: string[] = [];

    for (const file of selectedFiles) {
      const uploadRes = await uploadProductImage(file);
      if (uploadRes.success && uploadRes.imageUrl) {
        uploadedUrls.push(uploadRes.imageUrl);
      } else {
        setImageErrorMessage(uploadRes.error || `Failed to upload "${file.name}".`);
        break;
      }
    }

    setIsUploadingImage(false);

    if (uploadedUrls.length > 0) {
      setImages((prev) => [...prev, ...uploadedUrls].slice(0, 10));
    }
  };

  // Handle replacing a specific image at replaceImageIndex
  const handleReplaceSingleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || replaceImageIndex === null) return;

    setImageErrorMessage(null);
    setErrorMessage(null);

    const validationError = validateImageFile(file);
    if (validationError) {
      setImageErrorMessage(validationError);
      setReplaceImageIndex(null);
      return;
    }

    const targetIdx = replaceImageIndex;
    setReplaceImageIndex(null);
    setIsUploadingImage(true);

    const uploadRes = await uploadProductImage(file);
    setIsUploadingImage(false);

    if (uploadRes.success && uploadRes.imageUrl) {
      setImages((prev) => prev.map((img, idx) => (idx === targetIdx ? uploadRes.imageUrl! : img)));
    } else {
      setImageErrorMessage(uploadRes.error || 'Image replacement failed.');
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleMoveImage = (index: number, direction: 'left' | 'right') => {
    setImages((prev) => {
      const next = [...prev];
      const targetIndex = direction === 'left' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= next.length) return prev;
      const temp = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = temp;
      return next;
    });
  };

  const handleSelectSampleImage = (url: string) => {
    setImageErrorMessage(null);
    setImages((prev) => {
      if (prev.includes(url)) return prev;
      return [...prev, url].slice(0, 10);
    });
  };

  // Handle Product Video selection & upload
  const handleVideoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setVideoErrorMessage(null);
    setErrorMessage(null);

    const validationError = validateVideoFile(file);
    if (validationError) {
      setVideoErrorMessage(validationError);
      return;
    }

    setIsUploadingVideo(true);
    setVideoUploadProgress(5);

    const uploadRes = await uploadProductVideo(file, (percent) => {
      setVideoUploadProgress(percent);
    });

    setIsUploadingVideo(false);

    if (uploadRes.success && uploadRes.videoUrl) {
      setVideoUrl(uploadRes.videoUrl);
      setVideoFilename(file.name);
      setVideoUploadProgress(100);
    } else {
      setVideoErrorMessage(
        uploadRes.error || 'Video must be MP4, WEBM, or MOV and must be within the allowed file size.'
      );
      setVideoUploadProgress(0);
    }
  };

  const handleRemoveVideo = () => {
    setVideoUrl(null);
    setVideoFilename('');
    setVideoErrorMessage(null);
    setVideoUploadProgress(0);
    if (videoInputRef.current) {
      videoInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (isUploadingImage || isUploadingVideo) {
      setErrorMessage('Please wait for media uploads to finish before saving.');
      return;
    }

    // Validation
    if (!name.trim()) {
      setErrorMessage('Product Name is required.');
      return;
    }

    if (images.length === 0) {
      setErrorMessage('Please upload at least one product image.');
      return;
    }

    const numWeight = parseFloat(weight);
    if (isNaN(numWeight) || numWeight <= 0) {
      setErrorMessage('Please enter a valid stone weight greater than 0.');
      return;
    }

    let parsedPrice: number | null = null;
    if (priceDisplayType === 'fixed' || priceDisplayType === 'starting_from') {
      const p = parseFloat(priceAmount);
      if (isNaN(p) || p <= 0) {
        setErrorMessage(
          `A valid price amount is required when selecting "${
            priceDisplayType === 'fixed' ? 'Fixed Price' : 'Starting From'
          }".`
        );
        return;
      }
      parsedPrice = p;
    }

    if (!description.trim()) {
      setErrorMessage('Product description is required.');
      return;
    }

    setIsSubmitting(true);

    const productPayload: Partial<Gemstone> = {
      name: name.trim(),
      category,
      type,
      tagline: `${weight} ${weightUnit === 'ct' ? 'Carat' : 'Gram'} ${type} • ${
        origin || 'Natural Earth-Mined'
      }`,
      weight: numWeight,
      carat: weightUnit === 'ct' ? numWeight : numWeight * 5,
      weightUnit,
      priceDisplayType,
      priceAmount: parsedPrice,
      currency,
      priceUSD:
        currency === 'USD'
          ? parsedPrice || 0
          : parsedPrice
          ? Math.round(parsedPrice / 278)
          : 0,
      description: description.trim(),
      status,
      images,
      videoUrl: videoUrl || null,
      dimensions: dimensions.trim() || 'Precision Calibrated',
      origin: origin.trim() || 'Natural Earth-Mined',
      cut: cut.trim() || 'Precision Faceted',
      color: color.trim() || 'Natural Saturated Hue',
      clarity: clarity.trim() || 'Fine Gem Grade',
      treatment: treatment.trim() || 'Untreated / Natural Formation',
      isFeatured,
      isBestseller,
      certificate: {
        issuer: certificateIssuer.trim() || 'Gemological Inspection Report',
        reportNumber: certificateNumber.trim() || `GEO-${Date.now().toString().slice(-6)}`,
        verified: true,
      },
    };

    let result;
    if (productToEdit) {
      result = await updateProduct(productToEdit.id, productPayload);
    } else {
      result = await createProduct(productPayload);
    }

    setIsSubmitting(false);

    if (result.success) {
      onClose();
    } else {
      setErrorMessage(result.error || 'Failed to save product. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#171717]/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-screen px-3 sm:px-6 py-6 sm:py-10 flex items-center justify-center relative">
        <div
          className="relative bg-[#FAF8F3] rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-[#DED9CE] z-10 animate-in fade-in zoom-in-95 duration-200 text-[#151515]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E1D9CD] bg-white">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#FAF8F3] border border-[#B08D57] flex items-center justify-center text-[#B08D57]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-normal text-[#151515]">
                  {productToEdit ? 'Edit Stone Details' : 'Add New Stone'}
                </h2>
                <p className="text-[11px] text-[#716B60] font-sans">
                  Catalog entry — added gemstones and crystals update the website immediately.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-[#FAF8F3] text-[#716B60] hover:text-[#151515] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-8 space-y-6 max-h-[82vh] overflow-y-auto"
          >
            {errorMessage && (
              <div className="p-3.5 bg-[#A14B38]/10 border border-[#A14B38]/30 rounded-xl flex items-start gap-2.5 text-xs text-[#A14B38]">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* 1. PRODUCT NAME & CATEGORY */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-8">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#292820] mb-1.5">
                  Product Name <span className="text-[#A14B38]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Natural Green Swat Emerald or 5.20 ct Royal Ceylon Sapphire"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E1D9CD] rounded-lg text-sm text-[#151515] focus:outline-none focus:border-[#B08D57] focus:ring-1 focus:ring-[#B08D57]"
                />
              </div>

              <div className="sm:col-span-4">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#292820] mb-1.5">
                  Catalog Category <span className="text-[#A14B38]">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCategory('Gemstone')}
                    className={`py-2.5 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider border cursor-pointer transition-colors ${
                      category === 'Gemstone'
                        ? 'bg-[#B08D57] text-[#25221D] border-[#B08D57] shadow-xs'
                        : 'bg-white text-[#716B60] border-[#E1D9CD] hover:border-[#B08D57]'
                    }`}
                  >
                    Gemstone
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategory('Crystal')}
                    className={`py-2.5 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider border cursor-pointer transition-colors ${
                      category === 'Crystal'
                        ? 'bg-[#B08D57] text-[#25221D] border-[#B08D57] shadow-xs'
                        : 'bg-white text-[#716B60] border-[#E1D9CD] hover:border-[#B08D57]'
                    }`}
                  >
                    Crystal
                  </button>
                </div>
              </div>
            </div>

            {/* 2. PRODUCT MEDIA SECTION: SEPARATE PRODUCT IMAGES & PRODUCT VIDEO */}
            <div className="p-5 bg-white rounded-2xl border border-[#E1D9CD] space-y-6">
              <div className="border-b border-[#F0EAE1] pb-3">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-[#151515]">
                  Product Media
                </h3>
                <p className="text-[11px] text-[#716B60] mt-0.5">
                  Upload product photos for the stone gallery and an optional product video to
                  showcase natural brilliance.
                </p>
              </div>

              {/* A. PRODUCT IMAGES */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#292820]">
                      Product Images <span className="text-[#A14B38]">*</span>
                    </label>
                    <p className="text-[11px] text-[#716B60]">
                      Photos of the gemstone or crystal (JPG, JPEG, PNG, WEBP — up to 15MB each)
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={isUploadingImage || images.length >= 10}
                    onClick={() => imageInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#FAF8F3] hover:bg-[#F3EFE8] border border-[#B08D57] text-[#151515] text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#B08D57]" />
                    <span>Upload Images</span>
                  </button>
                </div>

                {/* Hidden File Inputs for Images */}
                <input
                  ref={imageInputRef}
                  type="file"
                  multiple
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  onChange={handleImageFilesChange}
                  className="hidden"
                />
                <input
                  ref={replaceImageInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  onChange={handleReplaceSingleImageChange}
                  className="hidden"
                />

                {imageErrorMessage && (
                  <div className="p-3 bg-[#A14B38]/10 border border-[#A14B38]/30 rounded-xl flex items-start gap-2 text-xs text-[#A14B38]">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{imageErrorMessage}</span>
                  </div>
                )}

                {/* Image Upload Dropzone & Previews */}
                {images.length === 0 ? (
                  <div
                    onClick={() => imageInputRef.current?.click()}
                    className="border-2 border-dashed border-[#B08D57]/60 hover:border-[#B08D57] bg-[#FAF8F3]/60 hover:bg-[#FAF8F3] rounded-xl p-6 text-center cursor-pointer transition-colors flex flex-col items-center justify-center min-h-[140px]"
                  >
                    {isUploadingImage ? (
                      <div className="flex flex-col items-center text-xs text-[#B08D57]">
                        <div className="w-6 h-6 border-2 border-[#B08D57] border-t-transparent rounded-full animate-spin mb-2" />
                        <span>Uploading product image(s)...</span>
                      </div>
                    ) : (
                      <>
                        <ImageIcon className="w-7 h-7 text-[#B08D57] mb-2" />
                        <p className="text-xs font-semibold text-[#151515]">
                          Click to Upload Product Images
                        </p>
                        <p className="text-[11px] text-[#716B60] mt-1">
                          Select one or multiple photos (JPG, PNG, WEBP up to 15MB)
                        </p>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {isUploadingImage && (
                      <div className="flex items-center gap-2 text-xs text-[#B08D57] bg-[#FAF8F3] px-3 py-2 rounded-lg border border-[#E1D9CD]">
                        <div className="w-4 h-4 border-2 border-[#B08D57] border-t-transparent rounded-full animate-spin" />
                        <span>Uploading image(s)...</span>
                      </div>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {images.map((imgUrl, idx) => (
                        <div
                          key={`${imgUrl}-${idx}`}
                          className="group relative aspect-square bg-[#FAF8F3] border border-[#E1D9CD] rounded-xl overflow-hidden flex flex-col justify-between"
                        >
                          <img
                            src={imgUrl}
                            alt={`Product photo ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />

                          {/* Top Badges & Reorder Controls */}
                          <div className="absolute top-2 inset-x-2 flex items-center justify-between gap-1">
                            {idx === 0 ? (
                              <span className="px-2 py-0.5 bg-[#151515]/80 backdrop-blur-xs text-[#FAF8F3] text-[10px] font-semibold uppercase tracking-wider rounded">
                                Main Photo
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.5 bg-[#151515]/65 backdrop-blur-xs text-white text-[10px] font-mono rounded">
                                #{idx + 1}
                              </span>
                            )}

                            {images.length > 1 && (
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={() => handleMoveImage(idx, 'left')}
                                  title="Move earlier"
                                  className="p-1 bg-black/65 hover:bg-black/85 text-white rounded disabled:opacity-30 cursor-pointer"
                                >
                                  <ArrowLeft className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === images.length - 1}
                                  onClick={() => handleMoveImage(idx, 'right')}
                                  title="Move later"
                                  className="p-1 bg-black/65 hover:bg-black/85 text-white rounded disabled:opacity-30 cursor-pointer"
                                >
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Bottom Replace & Remove Actions */}
                          <div className="absolute bottom-2 inset-x-2 flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setReplaceImageIndex(idx);
                                replaceImageInputRef.current?.click();
                              }}
                              className="px-2 py-1 bg-black/70 hover:bg-black/90 backdrop-blur-xs text-white text-[10px] uppercase font-semibold rounded cursor-pointer"
                            >
                              Replace
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              title="Remove image"
                              className="p-1 bg-[#A14B38]/90 hover:bg-[#A14B38] text-white rounded cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick sample pickers if testing on desktop */}
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#716B60] pt-1">
                  <span>Or add library specimen photo:</span>
                  {[
                    '/stones/emerald.jpg',
                    '/stones/ruby.jpg',
                    '/stones/sapphire.jpg',
                    '/stones/peridot.jpg',
                  ].map((src, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectSampleImage(src)}
                      className="px-2 py-0.5 bg-[#FAF8F3] border border-[#E1D9CD] hover:border-[#B08D57] rounded text-[10px] text-[#292820] cursor-pointer"
                    >
                      + {src.split('/').pop()?.replace('.jpg', '')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider between Images and Video */}
              <div className="border-t border-[#F0EAE1]" />

              {/* B. PRODUCT VIDEO */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#292820]">
                      Product Video <span className="text-[#716B60] font-normal">(Optional)</span>
                    </label>
                    <p className="text-[11px] text-[#716B60]">
                      Upload one video of this stone (MP4, WEBM, or MOV — up to 50MB)
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={isUploadingVideo}
                    onClick={() => videoInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#FAF8F3] hover:bg-[#F3EFE8] border border-[#B08D57] text-[#151515] text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Film className="w-3.5 h-3.5 text-[#B08D57]" />
                    <span>{videoUrl ? 'Replace Video' : 'Upload Video'}</span>
                  </button>
                </div>

                {/* Hidden File Input for Video */}
                <input
                  ref={videoInputRef}
                  type="file"
                  accept=".mp4,.webm,.mov,video/mp4,video/webm,video/quicktime"
                  onChange={handleVideoFileChange}
                  className="hidden"
                />

                {videoErrorMessage && (
                  <div className="p-3 bg-[#A14B38]/10 border border-[#A14B38]/30 rounded-xl flex items-start gap-2 text-xs text-[#A14B38]">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{videoErrorMessage}</span>
                  </div>
                )}

                {/* Video Upload Progress Bar */}
                {isUploadingVideo && (
                  <div className="p-4 bg-[#FAF8F3] border border-[#E1D9CD] rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs text-[#292820]">
                      <span className="font-medium">Uploading product video...</span>
                      <span className="font-mono font-semibold text-[#B08D57]">
                        {videoUploadProgress}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#E5DED2] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#B08D57] transition-all duration-200"
                        style={{ width: `${videoUploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Video Dropzone or Video Preview */}
                {!videoUrl && !isUploadingVideo ? (
                  <div
                    onClick={() => videoInputRef.current?.click()}
                    className="border-2 border-dashed border-[#E1D9CD] hover:border-[#B08D57] bg-[#FAF8F3]/60 hover:bg-[#FAF8F3] rounded-xl p-5 text-center cursor-pointer transition-colors flex flex-col items-center justify-center min-h-[120px]"
                  >
                    <Film className="w-7 h-7 text-[#B08D57] mb-2" />
                    <p className="text-xs font-semibold text-[#151515]">Choose Video</p>
                    <p className="text-[11px] text-[#716B60] mt-1">
                      Supported formats: MP4, WEBM, MOV (maximum 50MB)
                    </p>
                  </div>
                ) : videoUrl ? (
                  <div className="p-4 bg-[#FAF8F3] border border-[#E1D9CD] rounded-xl space-y-3">
                    <div className="aspect-video max-h-[240px] w-full bg-[#151515] rounded-lg overflow-hidden border border-[#E1D9CD] flex items-center justify-center">
                      <video
                        key={videoUrl}
                        src={videoUrl}
                        controls
                        muted
                        playsInline
                        preload="metadata"
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <div className="flex items-center gap-2 text-xs text-[#292820] truncate max-w-xs sm:max-w-md">
                        <Film className="w-4 h-4 text-[#B08D57] flex-shrink-0" />
                        <span className="font-mono text-[11px] truncate">
                          {videoFilename || extractFilenameFromUrl(videoUrl)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => videoInputRef.current?.click()}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-[#F3EFE8] border border-[#E1D9CD] hover:border-[#B08D57] text-[#151515] text-[11px] font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                        >
                          <RefreshCw className="w-3 h-3 text-[#B08D57]" />
                          <span>Replace</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleRemoveVideo}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#A14B38]/10 hover:bg-[#A14B38]/20 border border-[#A14B38]/30 text-[#A14B38] text-[11px] font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            {/* 3. WEIGHT & UNIT */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#292820] mb-1.5">
                  Weight Value <span className="text-[#A14B38]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#716B60]">
                    <Scale className="w-4 h-4" />
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="e.g. 3.50"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-[#E1D9CD] rounded-lg text-sm text-[#151515] focus:outline-none focus:border-[#B08D57] focus:ring-1 focus:ring-[#B08D57]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#292820] mb-1.5">
                  Weight Unit <span className="text-[#A14B38]">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setWeightUnit('ct')}
                    className={`py-2.5 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider border cursor-pointer transition-colors ${
                      weightUnit === 'ct'
                        ? 'bg-[#B08D57] text-[#25221D] border-[#B08D57] shadow-xs'
                        : 'bg-white text-[#716B60] border-[#E1D9CD] hover:border-[#B08D57]'
                    }`}
                  >
                    Carat (ct)
                  </button>
                  <button
                    type="button"
                    onClick={() => setWeightUnit('g')}
                    className={`py-2.5 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider border cursor-pointer transition-colors ${
                      weightUnit === 'g'
                        ? 'bg-[#B08D57] text-[#25221D] border-[#B08D57] shadow-xs'
                        : 'bg-white text-[#716B60] border-[#E1D9CD] hover:border-[#B08D57]'
                    }`}
                  >
                    Gram (g)
                  </button>
                </div>
              </div>
            </div>

            {/* 4. PRICE MANAGEMENT — STRICT DISCLOSURE RULES */}
            <div className="p-4 bg-white rounded-xl border border-[#E1D9CD] space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#292820] mb-1">
                  Price Display Type <span className="text-[#A14B38]">*</span>
                </label>
                <p className="text-[11px] text-[#716B60] mb-3">
                  Never assign fake prices. If unconfirmed, select "Price on Request" to direct
                  customers to WhatsApp.
                </p>

                {/* 3 Options */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Option A */}
                  <div
                    onClick={() => setPriceDisplayType('fixed')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      priceDisplayType === 'fixed'
                        ? 'bg-[#FAF8F3] border-[#B08D57] ring-1 ring-[#B08D57]'
                        : 'border-[#E1D9CD] hover:border-[#B08D57]/60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="priceType"
                        checked={priceDisplayType === 'fixed'}
                        onChange={() => setPriceDisplayType('fixed')}
                        className="text-[#B08D57] focus:ring-[#B08D57]"
                      />
                      <span className="text-xs font-semibold text-[#151515]">Fixed Price</span>
                    </div>
                    <p className="text-[11px] text-[#716B60] mt-1 ml-5">
                      Enter confirmed exact sales price.
                    </p>
                  </div>

                  {/* Option B */}
                  <div
                    onClick={() => {
                      setPriceDisplayType('on_request');
                      setPriceAmount('');
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      priceDisplayType === 'on_request'
                        ? 'bg-[#FAF8F3] border-[#B08D57] ring-1 ring-[#B08D57]'
                        : 'border-[#E1D9CD] hover:border-[#B08D57]/60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="priceType"
                        checked={priceDisplayType === 'on_request'}
                        onChange={() => {
                          setPriceDisplayType('on_request');
                          setPriceAmount('');
                        }}
                        className="text-[#B08D57] focus:ring-[#B08D57]"
                      />
                      <span className="text-xs font-semibold text-[#151515]">Price on Request</span>
                    </div>
                    <p className="text-[11px] text-[#716B60] mt-1 ml-5">
                      No price required. Prompts "Inquire on WhatsApp".
                    </p>
                  </div>

                  {/* Option C */}
                  <div
                    onClick={() => setPriceDisplayType('starting_from')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      priceDisplayType === 'starting_from'
                        ? 'bg-[#FAF8F3] border-[#B08D57] ring-1 ring-[#B08D57]'
                        : 'border-[#E1D9CD] hover:border-[#B08D57]/60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="priceType"
                        checked={priceDisplayType === 'starting_from'}
                        onChange={() => setPriceDisplayType('starting_from')}
                        className="text-[#B08D57] focus:ring-[#B08D57]"
                      />
                      <span className="text-xs font-semibold text-[#151515]">Starting From</span>
                    </div>
                    <p className="text-[11px] text-[#716B60] mt-1 ml-5">
                      Displays confirmed floor starting price.
                    </p>
                  </div>
                </div>
              </div>

              {/* Price inputs if fixed or starting_from */}
              {priceDisplayType !== 'on_request' && (
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
                  <div className="sm:col-span-8">
                    <label className="block text-xs font-medium text-[#292820] mb-1">
                      {priceDisplayType === 'fixed'
                        ? 'Confirmed Exact Price'
                        : 'Starting Price Floor'}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#716B60]">
                        <DollarSign className="w-4 h-4" />
                      </div>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        required
                        value={priceAmount}
                        onChange={(e) => setPriceAmount(e.target.value)}
                        placeholder="e.g. 4500"
                        className="w-full pl-9 pr-3.5 py-2 bg-[#FAF8F3] border border-[#E1D9CD] rounded-lg text-sm text-[#151515] focus:outline-none focus:border-[#B08D57]"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <label className="block text-xs font-medium text-[#292820] mb-1">
                      Currency
                    </label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FAF8F3] border border-[#E1D9CD] rounded-lg text-sm text-[#151515] focus:outline-none focus:border-[#B08D57]"
                    >
                      {CURRENCY_OPTIONS.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* 5. DESCRIPTION */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#292820] mb-1.5">
                Description &amp; Gemological Characteristics <span className="text-[#A14B38]">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter verified details regarding the specimen's color tone, crystal structure, inclusions, origin, and natural brilliance..."
                className="w-full px-3.5 py-2.5 bg-white border border-[#E1D9CD] rounded-lg text-sm text-[#151515] focus:outline-none focus:border-[#B08D57] focus:ring-1 focus:ring-[#B08D57]"
              />
            </div>

            {/* 6. PRODUCT STATUS */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#292820] mb-1.5">
                Product Publication Status <span className="text-[#A14B38]">*</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {/* Published */}
                <button
                  type="button"
                  onClick={() => setStatus('published')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    status === 'published'
                      ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500'
                      : 'bg-white border-[#E1D9CD] hover:border-[#B08D57]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                      Published
                    </span>
                    {status === 'published' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    )}
                  </div>
                  <p className="text-[11px] text-emerald-700/80 mt-1">
                    Immediately live on website.
                  </p>
                </button>

                {/* Draft */}
                <button
                  type="button"
                  onClick={() => setStatus('draft')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    status === 'draft'
                      ? 'bg-slate-100 border-slate-600 ring-1 ring-slate-600'
                      : 'bg-white border-[#E1D9CD] hover:border-[#B08D57]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Draft
                    </span>
                    {status === 'draft' && <CheckCircle2 className="w-4 h-4 text-slate-600" />}
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Hidden from public view.
                  </p>
                </button>

                {/* Reserved */}
                <button
                  type="button"
                  onClick={() => setStatus('reserved')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    status === 'reserved'
                      ? 'bg-blue-50 border-blue-600 ring-1 ring-blue-600'
                      : 'bg-white border-[#E1D9CD] hover:border-[#B08D57]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">
                      Reserved
                    </span>
                    {status === 'reserved' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                  </div>
                  <p className="text-[11px] text-blue-700/80 mt-1">
                    Shown as on hold / reserved.
                  </p>
                </button>

                {/* Sold Out */}
                <button
                  type="button"
                  onClick={() => setStatus('sold_out')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    status === 'sold_out'
                      ? 'bg-amber-50 border-amber-600 ring-1 ring-amber-600'
                      : 'bg-white border-[#E1D9CD] hover:border-[#B08D57]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                      Sold Out
                    </span>
                    {status === 'sold_out' && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                  </div>
                  <p className="text-[11px] text-amber-700/80 mt-1">
                    Marked sold. Allows similar inquiry.
                  </p>
                </button>
              </div>
            </div>

            {/* Optional Collapsible Specs */}
            <div className="border border-[#E1D9CD] rounded-xl overflow-hidden bg-white">
              <button
                type="button"
                onClick={() => setShowAdvancedSpecs(!showAdvancedSpecs)}
                className="w-full px-4 py-3 bg-[#FAF8F3] hover:bg-[#F5F1E9] text-left flex items-center justify-between text-xs font-semibold text-[#292820] cursor-pointer transition-colors"
              >
                <span>
                  Optional Gemological Specifications (Variety, Dimensions, Origin, Cut, Lab Report)
                </span>
                {showAdvancedSpecs ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {showAdvancedSpecs && (
                <div className="p-4 space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-[#292820] mb-1">
                        Stone Variety / Type
                      </label>
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full px-3 py-2 bg-[#FAF8F3] border border-[#E1D9CD] rounded-lg text-sm"
                      >
                        {COMMON_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-medium text-[#292820] mb-1">
                        Dimensions (mm)
                      </label>
                      <input
                        type="text"
                        value={dimensions}
                        onChange={(e) => setDimensions(e.target.value)}
                        placeholder="e.g. 9.4 x 7.2 x 4.8 mm"
                        className="w-full px-3 py-2 bg-[#FAF8F3] border border-[#E1D9CD] rounded-lg text-sm"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-[#292820] mb-1">
                        Geographic Origin
                      </label>
                      <input
                        type="text"
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                        placeholder="e.g. Mogok Myanmar, Swat Valley Pakistan"
                        className="w-full px-3 py-2 bg-[#FAF8F3] border border-[#E1D9CD] rounded-lg text-sm"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-[#292820] mb-1">
                        Cut &amp; Shape Style
                      </label>
                      <input
                        type="text"
                        value={cut}
                        onChange={(e) => setCut(e.target.value)}
                        placeholder="e.g. Cushion Brilliant Cut, Octagon Step Cut"
                        className="w-full px-3 py-2 bg-[#FAF8F3] border border-[#E1D9CD] rounded-lg text-sm"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-[#292820] mb-1">
                        Color / Saturation
                      </label>
                      <input
                        type="text"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        placeholder="e.g. Vivid Pigeon Blood Red, Royal Blue"
                        className="w-full px-3 py-2 bg-[#FAF8F3] border border-[#E1D9CD] rounded-lg text-sm"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-[#292820] mb-1">Clarity Grade</label>
                      <input
                        type="text"
                        value={clarity}
                        onChange={(e) => setClarity(e.target.value)}
                        placeholder="e.g. Eye Clean (VVS), Transparent"
                        className="w-full px-3 py-2 bg-[#FAF8F3] border border-[#E1D9CD] rounded-lg text-sm"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-[#292820] mb-1">
                        Treatment Disclosure
                      </label>
                      <input
                        type="text"
                        value={treatment}
                        onChange={(e) => setTreatment(e.target.value)}
                        placeholder="e.g. Completely Untreated / No Heat"
                        className="w-full px-3 py-2 bg-[#FAF8F3] border border-[#E1D9CD] rounded-lg text-sm"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-[#292820] mb-1">
                        Testing Lab / Authority
                      </label>
                      <input
                        type="text"
                        value={certificateIssuer}
                        onChange={(e) => setCertificateIssuer(e.target.value)}
                        placeholder="e.g. GIA, GRS, Gübelin, Self-Inspected"
                        className="w-full px-3 py-2 bg-[#FAF8F3] border border-[#E1D9CD] rounded-lg text-sm"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-medium text-[#292820] mb-1">Report Number</label>
                      <input
                        type="text"
                        value={certificateNumber}
                        onChange={(e) => setCertificateNumber(e.target.value)}
                        placeholder="e.g. GIA-2026-90412"
                        className="w-full px-3 py-2 bg-[#FAF8F3] border border-[#E1D9CD] rounded-lg text-sm"
                      />
                    </div>

                    <div className="sm:col-span-2 flex flex-wrap items-center gap-6 pt-2">
                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isFeatured}
                          onChange={(e) => setIsFeatured(e.target.checked)}
                          className="rounded border-[#E1D9CD] text-[#B08D57] focus:ring-[#B08D57]"
                        />
                        <span className="text-xs font-medium text-[#292820]">
                          Feature in Homepage Showcase
                        </span>
                      </label>

                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isBestseller}
                          onChange={(e) => setIsBestseller(e.target.checked)}
                          className="rounded border-[#E1D9CD] text-[#B08D57] focus:ring-[#B08D57]"
                        />
                        <span className="text-xs font-medium text-[#292820]">
                          Collector Highlight Badge
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-[#E1D9CD] flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-3 border border-[#E1D9CD] hover:border-[#716B60] text-[#716B60] hover:text-[#151515] text-xs font-semibold tracking-wider uppercase rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting || isUploadingImage || isUploadingVideo}
                className="primary-button w-full sm:w-auto disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Saving Specimen...</span>
                ) : (
                  <span>{productToEdit ? 'Update Stone' : 'Publish Stone'}</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
