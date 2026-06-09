import React, { useCallback } from "react";
import type { Swiper as SwiperInstance } from "swiper";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import AnimateOnScroll from "../common/animate-on-scroll";
import TestimonialCard from "../common/testimonial-card";
import TESTIMONIALS from "../../data/testimonials";
import { Title } from "../ui/typography";
import "swiper/css";

function TestimonialsSection() {
  const handleSwiperInit = useCallback((swiper: SwiperInstance) => {
    swiper.autoplay.start();
  }, []);

  return (
    <section className="overflow-hidden bg-background px-4 py-14 sm:px-6 nav:py-20 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <AnimateOnScroll variant="fade-up" className="mx-auto mb-10 max-w-2xl text-center nav:mb-14">
          <Title level={2} className="text-foreground">
            Loved by teams like yours
          </Title>
        </AnimateOnScroll>

        <AnimateOnScroll variant="scale-in" delay={120} className="overflow-hidden">
          <Swiper
            modules={[Autoplay]}
            onSwiper={handleSwiperInit}
            slidesPerView={1}
            spaceBetween={24}
            loop
            loopAdditionalSlides={5}
            speed={4500}
            watchSlidesProgress
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
              stopOnLastSlide: false,
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              880: {
                slidesPerView: 3,
              },
            }}
            className="pb-2"
          >
            {TESTIMONIALS.map((testimonial) => (
              <SwiperSlide key={testimonial.id} className="h-auto!">
                <TestimonialCard
                  quote={testimonial.quote}
                  name={testimonial.name}
                  role={testimonial.role}
                  avatarUrl={testimonial.avatarUrl}
                  rating={testimonial.rating}
                  className="h-full"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </AnimateOnScroll>
      </div>
    </section>
  );
}

export default React.memo(TestimonialsSection);
