import mongoose, { Schema } from "mongoose";

import type { IDesignSpaceTypeBenchmark } from "../../interfaces/benchmark/IBenchMark";

const designBenchMarkSchema = new Schema<IDesignSpaceTypeBenchmark>(
    {
        averageMaxPrice: { type: Number, required: true, min: 0, },

        averageMinPrice: { type: Number, required: true, min: 0, },

        noOfDesigns: { type: Number, required: true, min: 0, default: 0, },

        spaceType: { type: String, required: true, trim: true, unique: true, },

        lastUpdated: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export const DesignBenchmarkModel =
    mongoose.model<IDesignSpaceTypeBenchmark>(
        "DesignBenchmark",
        designBenchMarkSchema
    );