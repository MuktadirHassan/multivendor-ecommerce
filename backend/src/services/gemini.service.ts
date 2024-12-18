import { GoogleGenerativeAI } from "@google/generative-ai";
import pino from "pino";

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private embeddingModel: any;
  private textModel: any;
  private logger: pino.Logger;

  constructor(apiKey: string) {
    this.logger = pino({
      level: "debug",
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "HH:MM:ss.l",
        },
      },
    }).child({ service: "GeminiService" });

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.embeddingModel = this.genAI.getGenerativeModel({
      model: "text-embedding-004",
    });
    this.textModel = this.genAI.getGenerativeModel({ model: "gemini-pro" });

    this.logger.info("Models initialized successfully");
  }

  async generateEmbeddings(text: string): Promise<number[]> {
    const startTime = performance.now();

    try {
      this.logger.debug({ textLength: text.length }, "Generating embeddings");
      const result = await this.embeddingModel.embedContent(text);
      const embeddings = result.embedding.values;

      const duration = performance.now() - startTime;
      this.logger.debug(
        { duration: `${duration.toFixed(2)}ms`, vectorSize: embeddings.length },
        "Embeddings generated"
      );

      return embeddings;
    } catch (error) {
      this.logger.error(
        { error, duration: `${(performance.now() - startTime).toFixed(2)}ms` },
        "Failed to generate embeddings"
      );
      throw error;
    }
  }

  async generateProductDescription(
    name: string,
    category: string
  ): Promise<string> {
    this.logger.info({ name, category }, "Generating product description");

    try {
      const prompt = `Generate a detailed product description for a ${name} in the ${category} category. 
                     Include key features and benefits.`;

      const result = await this.textModel.generateText(prompt);
      this.logger.debug(
        { description: result.text.substring(0, 100) },
        "Product description generated"
      );
      return result.text;
    } catch (error) {
      this.logger.error(
        { error, name, category },
        "Failed to generate product description"
      );
      throw error;
    }
  }

  async searchProducts(query: string, products: any[]): Promise<any[]> {
    this.logger.info(
      { query, productCount: products.length },
      "Searching products"
    );

    try {
      const startTime = performance.now();
      if (!query || !products.length) {
        this.logger.warn(
          { query, productCount: products.length },
          "Invalid search query or empty product list"
        );
        return [];
      }
      const queryEmbedding = await this.generateEmbeddings(query);

      const productsWithScores = await Promise.all(
        products.map(async (product) => {
          const productText = `${product.name} ${product.description} ${product.category.name}`;
          this.logger.debug(
            { productId: product.id },
            "Generating product embedding"
          );

          const productEmbedding = await this.generateEmbeddings(productText);
          const similarity = this.cosineSimilarity(
            queryEmbedding,
            productEmbedding
          );

          this.logger.debug(
            { productId: product.id, similarity },
            "Similarity score calculated"
          );

          return { ...product, similarity };
        })
      );

      const results = productsWithScores
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 10);

      const duration = performance.now() - startTime;
      this.logger.info(
        {
          duration,
          resultCount: results.length,
          topScore: results[0]?.similarity,
        },
        "Search completed"
      );

      return results;
    } catch (error) {
      this.logger.error({ error, query }, "Product search failed");
      throw error;
    }
  }

  async generateRecommendations(
    userId: number,
    userHistory: any[],
    allProducts: any[]
  ): Promise<any[]> {
    this.logger.info(
      { userId, historyCount: userHistory.length },
      "Generating recommendations"
    );

    try {
      const userProfile = userHistory
        .map((item) => `${item.name} ${item.category.name}`)
        .join(" ");

      const prompt = `Based on a user who has shown interest in: ${userProfile}
                     Generate product recommendations considering these preferences.`;

      this.logger.debug(
        { userId, prompt },
        "Generating recommendation context"
      );
      const result = await this.textModel.generateText(prompt);
      const recommendationContext = result.text;

      this.logger.debug(
        { userId, context: recommendationContext.substring(0, 100) },
        "Recommendation context generated"
      );

      const recommendations = await this.searchProducts(
        recommendationContext,
        allProducts
      );

      this.logger.info(
        {
          userId,
          recommendationCount: recommendations.length,
          topScore: recommendations[0]?.similarity,
        },
        "Recommendations generated successfully"
      );

      return recommendations;
    } catch (error) {
      this.logger.error(
        { error, userId },
        "Failed to generate recommendations"
      );
      throw error;
    }
  }

  private cosineSimilarity(vec1: number[], vec2: number[]): number {
    try {
      const dotProduct = vec1.reduce((acc, val, i) => acc + val * vec2[i], 0);
      const norm1 = Math.sqrt(vec1.reduce((acc, val) => acc + val * val, 0));
      const norm2 = Math.sqrt(vec2.reduce((acc, val) => acc + val * val, 0));

      const similarity = dotProduct / (norm1 * norm2);

      if (isNaN(similarity)) {
        this.logger.warn(
          { vec1Length: vec1.length, vec2Length: vec2.length },
          "Cosine similarity calculation resulted in NaN"
        );
        return 0;
      }

      return similarity;
    } catch (error) {
      this.logger.error(
        { error, vec1Length: vec1.length, vec2Length: vec2.length },
        "Error calculating cosine similarity"
      );
      throw error;
    }
  }
}
