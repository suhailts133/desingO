import { joiResolver } from '@hookform/resolvers/joi';
import { useForm, Controller, useWatch } from 'react-hook-form';
import type { ReviewPayloadFields } from '../proposalInterface';
import { reviewValidation } from '../../../validations/reviewValdiation';
import SubmitButton from '../../../shared/common/SubmitButton';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: ReviewPayloadFields) => void;
    isLoading: boolean;
};

const STARS = [1, 2, 3, 4, 5];

const starLabels: Record<number, string> = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent',
};

export default function WriteReviewModal({ onClose, isOpen, onConfirm, isLoading }: Props) {
    
    const { register, handleSubmit, control, formState: { errors }, } = useForm<ReviewPayloadFields>({
        resolver: joiResolver(reviewValidation),
        mode: 'onBlur',
        defaultValues: { rating: 0, comment: '' },
    });
    
    const selectedRating = useWatch({control,name:'rating'});
    if (!isOpen) return null;
    
    const onSubmit = (data: ReviewPayloadFields) => {
        onConfirm(data);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 animate-in zoom-in duration-200">
                <h2 className="text-4xl font-semibold text-soft-black mb-6 text-center font-Dynalight-Regular">designO</h2>
                <p className="text-center text-lg font-Jost-Semibold text-gray-500 mb-6">Write a Review</p>

                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>

                    {/* Star Rating */}
                    <div>
                        <label className="block text-sm font-Jost-Semibold text-gray-700 mb-2">
                            Your Rating
                        </label>
                        <Controller
                            name="rating"
                            control={control}
                            render={({ field }) => (
                                <div className="flex items-center gap-1">
                                    {STARS.map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => field.onChange(star)}
                                            className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                                        >
                                            <svg
                                                className={`w-8 h-8 transition-colors duration-150 ${star <= (selectedRating ?? 0)
                                                    ? 'text-yellow-400 fill-yellow-400'
                                                    : 'text-gray-300 fill-gray-300'
                                                    }`}
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={1}
                                            >
                                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                            </svg>
                                        </button>
                                    ))}
                                    {selectedRating > 0 && (
                                        <span className="ml-2 text-sm font-Jost-Semibold text-gray-500">
                                            {starLabels[selectedRating]}
                                        </span>
                                    )}
                                </div>
                            )}
                        />
                        {errors.rating && (
                            <p className="text-sm text-red-500 mt-1">{errors.rating.message}</p>
                        )}
                    </div>

                    {/* Review Comment */}
                    <div>
                        <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">
                            Your Review
                        </label>
                        <textarea
                            {...register('comment')}
                            className="auth-input min-h-30 pt-3"
                            placeholder="Share your experience working with this designer..."
                        />
                        {errors.comment && (
                            <p className="text-sm text-red-500 mt-1">{errors.comment.message}</p>
                        )}
                    </div>


                    <div className="flex flex-col gap-3 pt-4">
                        <SubmitButton type='submit' isLoading={isLoading} label='Submit Reiview' loadingLabel='Submitting' />
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="text-gray-500 hover:text-gray-800 text-sm font-medium"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}