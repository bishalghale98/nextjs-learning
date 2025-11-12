'use client'

import React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import messages from '@/messages.json'
import Autoplay from "embla-carousel-autoplay"
import { motion } from 'framer-motion'
import features from '@/features.json'
const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-8 md:py-16">
        {/* Hero Section with Material Design elevation and motion */}
        <motion.section
          className="text-center mb-12 md:mb-16 max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1
            className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Dive into the World of Anonymous Feedback
          </motion.h1>
          <motion.p
            className="mt-4 md:mt-6 text-lg md:text-xl text-gray-300 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            True Feedback - Where your identity remains a secret.
            Share your thoughts freely in a secure, private space designed for honest communication.
          </motion.p>
        </motion.section>

        {/* Carousel Section with Material Design cards and Apple HIG clarity */}
        <motion.div
          className="w-full max-w-sm md:max-w-2xl lg:max-w-4xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Carousel
            plugins={[Autoplay({ delay: 4000, stopOnInteraction: true })]}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <motion.div
                    className="p-2 h-full"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Card className="h-full bg-white/5 backdrop-blur-sm border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 group">
                      <CardHeader className="pb-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                          <h3 className="font-semibold text-white group-hover:text-blue-300 transition-colors duration-300">
                            {message.title}
                          </h3>
                        </div>
                      </CardHeader>
                      <CardContent className="flex flex-col justify-between p-6">
                        <span className="text-gray-200 leading-relaxed text-center">
                          {message.content}
                        </span>
                        <div className="mt-4 flex justify-center">
                          <div className="w-8 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Navigation Arrows with Apple HIG clarity */}
            <div className="flex justify-center mt-6 space-x-4">
              <CarouselPrevious className="relative static transform-none bg-white/10 hover:bg-white/20 border-0 text-white" />
              <CarouselNext className="relative static transform-none bg-white/10 hover:bg-white/20 border-0 text-white" />
            </div>
          </Carousel>
        </motion.div>

        {/* Additional Features Section */}
        <motion.section
          className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300"
              whileHover={{ y: -5 }}
            >
              <div className="text-2xl mb-3">{feature.icon}</div>
              <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </motion.section>
      </main>

      {/* Footer with Material Design elevation */}
      <motion.footer
        className="bg-black/50 backdrop-blur-sm border-t border-white/10 py-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-gray-400">
            © 2023 True Feedback. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Building trust through anonymous, honest communication.
          </p>
        </div>
      </motion.footer>
    </div>
  )
}

export default HomePage