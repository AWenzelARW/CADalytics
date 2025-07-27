export class ChatHandler {
  constructor() {
    this.intentKeywords = {
      lisp: ['lisp', 'routine', 'automation', 'script', 'automate', 'batch', 'macro'],
      template: ['template', 'style', 'layer', 'drawing', 'standard', 'format', 'layout'],
      subassembly: ['subassembly', 'corridor', 'curb', 'road', 'pavement', 'assembly', 'cross-section'],
      custom: ['custom', 'special', 'consultation', 'unique', 'specific', 'tailored']
    };

    this.responses = {
      lisp: {
        message: "I can help you create LISP routines for Civil 3D automation. What specific tasks would you like to automate?",
        suggestions: ["Batch processing", "Drawing automation", "Data extraction", "Survey point processing"],
        nextSteps: ["Describe your automation needs", "Review available routines", "Get cost estimate"]
      },
      template: {
        message: "I'll help you create drawing templates and standards. What type of project templates do you need?",
        suggestions: ["Standard templates", "Custom styles", "Layer standards", "Title blocks"],
        nextSteps: ["Define template requirements", "Select base template", "Configure styles"]
      },
      subassembly: {
        message: "I can help you select corridor subassemblies for road design. What type of road elements do you need?",
        suggestions: ["Basic road sections", "Curb and gutter", "Sidewalk assemblies", "Median sections"],
        nextSteps: ["Specify road type", "Choose subassembly components", "Review configurations"]
      },
      custom: {
        message: "I understand you have custom requirements. Let me help you create a specialized solution.",
        suggestions: ["Custom automation", "Specialized templates", "Consultation", "Training"],
        nextSteps: ["Describe your specific needs", "Review custom options", "Schedule consultation"]
      },
      general: {
        message: "Welcome to CADalytics Creator Factory! I'm your AI assistant for Civil 3D tool creation. I can help you with:",
        suggestions: ["LISP routines", "Drawing templates", "Corridor subassemblies", "Custom solutions"],
        nextSteps: ["Tell me about your project", "Choose a creator type", "Ask specific questions"]
      }
    };

    this.pricing = {
      lispRoutine: 5,
      templateBase: 30,
      templateStyle: 10,
      templateLayer: 5,
      subassembly: 20,
      customPackage: 100
    };
  }

  detectIntent(message) {
    const lowerMessage = message.toLowerCase();
    let bestMatch = null;
    let maxScore = 0;

    for (const [intent, keywords] of Object.entries(this.intentKeywords)) {
      const matches = keywords.filter(keyword => lowerMessage.includes(keyword));
      const score = matches.length / keywords.length;
      
      if (score > maxScore) {
        maxScore = score;
        bestMatch = intent;
      }
    }

    const confidence = maxScore > 0 ? Math.min(0.8 + (maxScore * 0.2), 1.0) : 0.3;
    
    return {
      intent: bestMatch || 'general',
      confidence: confidence,
      matchedKeywords: bestMatch ? this.intentKeywords[bestMatch].filter(k => lowerMessage.includes(k)) : []
    };
  }

  generateResponse(intent, userMessage) {
    const responseData = this.responses[intent] || this.responses.general;
    
    return {
      message: responseData.message,
      suggestions: responseData.suggestions,
      nextSteps: responseData.nextSteps,
      extractedInfo: this.extractInformation(userMessage, intent)
    };
  }

  extractInformation(message, intent) {
    const info = {};
    const lowerMessage = message.toLowerCase();

    // Extract numbers (quantities, versions, etc.)
    const numbers = message.match(/\d+/g);
    if (numbers) {
      info.quantities = numbers.map(n => parseInt(n));
    }

    // Extract Civil 3D specific terms
    const civil3dTerms = ['civil 3d', 'c3d', 'autocad civil', 'land desktop'];
    info.software = civil3dTerms.find(term => lowerMessage.includes(term)) || 'civil 3d';

    // Intent-specific extraction
    switch (intent) {
      case 'lisp':
        if (lowerMessage.includes('batch')) info.type = 'batch processing';
        if (lowerMessage.includes('survey')) info.type = 'survey processing';
        if (lowerMessage.includes('point')) info.involves = 'points';
        break;
      case 'template':
        if (lowerMessage.includes('title')) info.includes = 'title blocks';
        if (lowerMessage.includes('layer')) info.includes = 'layer standards';
        break;
      case 'subassembly':
        if (lowerMessage.includes('road')) info.type = 'road design';
        if (lowerMessage.includes('curb')) info.includes = 'curb and gutter';
        break;
    }

    return info;
  }

  calculateCost(selections) {
    const costs = {
      lisp: (selections.lispRoutines?.length || 0) * this.pricing.lispRoutine,
      template: 0,
      subassemblies: (selections.subassemblies?.length || 0) * this.pricing.subassembly,
      custom: selections.customPackage ? this.pricing.customPackage : 0
    };

    if (selections.templateBase) {
      costs.template += this.pricing.templateBase;
      costs.template += (selections.templateStyles?.length || 0) * this.pricing.templateStyle;
      costs.template += (selections.templateLayers?.length || 0) * this.pricing.templateLayer;
    }

    const totalCost = Object.values(costs).reduce((sum, cost) => sum + cost, 0);

    // Generate recommendations
    const recommendations = [];
    if (costs.lisp > 0 && costs.template === 0) {
      recommendations.push("Consider adding templates to complement your LISP routines");
    }
    if (costs.template > 0 && costs.subassemblies === 0) {
      recommendations.push("Add subassemblies for complete road design workflow");
    }
    if (totalCost > 50) {
      recommendations.push("Bundle discount available for orders over $50");
    }

    return {
      totalCost,
      breakdown: costs,
      recommendations,
      savings: totalCost > 100 ? Math.round(totalCost * 0.1) : 0
    };
  }

  async processMessage(chatRequest) {
    try {
      const { message, sessionId, userId } = chatRequest;

      // Step 1: Detect intent
      const intentResult = this.detectIntent(message);
      
      // Step 2: Generate response
      const responseData = this.generateResponse(intentResult.intent, message);

      // Step 3: Combine results
      return {
        intent: intentResult.intent,
        confidence: intentResult.confidence,
        message: responseData.message,
        suggestions: responseData.suggestions,
        nextSteps: responseData.nextSteps,
        extractedInfo: responseData.extractedInfo,
        matchedKeywords: intentResult.matchedKeywords,
        sessionId,
        userId,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error processing message:', error);
      
      return {
        intent: 'error',
        confidence: 0,
        message: "I apologize, but I encountered an error processing your request. Could you please try rephrasing your question?",
        suggestions: ["Try a different phrasing", "Contact support", "Refresh and try again"],
        nextSteps: ["Rephrase your request"],
        extractedInfo: {},
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}