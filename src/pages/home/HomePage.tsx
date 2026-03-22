/** @format */

import React from "react";
import { HeroSection, FeaturedComponents, StatsSection, TagsSection, TopCreators} from "@/components";

const HomePage: React.FunctionComponent = () => {
    return (
        <div>
            <HeroSection />
            <FeaturedComponents />
            <StatsSection />
            <TagsSection />
            <TopCreators />
        </div>
    );
};

export {
    HomePage
}
